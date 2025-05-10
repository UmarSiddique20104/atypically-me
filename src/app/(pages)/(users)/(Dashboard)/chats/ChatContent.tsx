"use client";
import ChatWindow, {
  Message,
} from "@/app/(pages)/components/ChatsComponent/ChatWindow";
import UserList from "@/app/(pages)/components/ChatsComponent/UserList";
import { useEffect, useState } from "react";

import { getUserChannels } from "@/app/(pages)/components/reuseable/ApiCall";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import type { RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addChannelName } from "@/app/redux/users/profileSlice";
import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
import ChatHeader from "@/app/components/sidebar/MainHeader/ChatHeader";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";

type User = {
  id: number;
  _id?: number;
  attributes?: {
    name: string;
    noOfUsers?: string;
  };
  participants?: {
    userId: {
      nickName?: string;
      image?: string;
      _id?: string;
    };
  };
  isUser?: boolean;
};


const ChatContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const chatData = useSelector((state: RootState) => state.sockets.chatData);
  const dispatch = useDispatch();
  useTokenRedirect();

  const getAllChannels = async () => {
    setIsLoading(true)
    const allChannels = await getUserChannels(API_ENDPOINTS.GET_CHANNELS);
    setChannels(allChannels?.data);
    const allDirectUsers = await getUserChannels(
      API_ENDPOINTS.GET_CONVERSATIONS
    );
    setAllUsers(allDirectUsers?.data?.attributes?.rows);
    setIsLoading(false)

  };

  useEffect(() => {
    getAllChannels();
    if (chatData) {
      selectUser(chatData);
    }
  }, []);

  const selectUser = async (user: User) => {
    if (user) {
      setSelectedUser(user);
      dispatch(
        addChannelName({ channelName: user?.participants?.userId?.nickName! })
      );
      let allMessages;
      if (user?.isUser) {
        allMessages = await getUserChannels(
          `${API_ENDPOINTS.GET_CONVERSATIONS}/${user._id}`
        );
        allMessages = allMessages?.data[0]?.attributes?.rows;

      } else {
        allMessages = await getUserChannels(
          `${API_ENDPOINTS.GET_CHANNELS}/${user.id}`
        );

        allMessages = allMessages?.data[0]?.attributes?.posts[0]?.rows;
      }
      setMessages(allMessages);
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}

      <div className="flex flex-col w-full h-svh overflow-y-scroll overflow-x-hidden">
        <div className="fixed  md:top-0 top-0 w-full">
          <ChatHeader
            /////////////////////////////////////////////////if selected User.channelname
            title={`${chatData?.attributes?.name!
              ? `${chatData?.attributes?.name}`
              : ""
              }`}

            subtitle={`${!selectedUser?.isUser
              ? selectedUser?.attributes?.noOfUsers
                ? `${selectedUser?.attributes?.noOfUsers} members`
                : ""
              : ""
              }`}
            goto="/home"
            bg="orange-darker"
            font="24px"
            paddding={true}
          />
        </div>

        <div className="ml-24 max-sm:ml-0 max-sm:overflow-y-scroll md:ml-ml-28 flex-1 max-sm:!pt-52  sm:!pt-36 overflow-hidden h-svh">
          <div className="flex h-full pt-2">
            <div className="max-lg:hidden sm:w-[520px] lg:w-[350px] border   h-full overflow-hidden">
              <div className="h-full overflow-y-auto  bg-[#f5f5f5] border-[1px] border-solid  border-r-black " id="style-1">
                <UserList
                  user={selectedUser}
                  users={channels}
                  directUsers={allUsers}
                  selectUser={async (user) => {
                    if (user) {
                      setSelectedUser(user);
                      let allMessages;
                      if (user?.isUser) {
                        dispatch(
                          addChannelName({
                            channelName: user?.participants?.userId?.nickName!,
                          })
                        );
                        allMessages = await getUserChannels(
                          `${API_ENDPOINTS.GET_CONVERSATIONS}/${user._id}`
                        );
                        allMessages = allMessages?.data[0]?.attributes?.rows;
                      } else {
                        dispatch(
                          addChannelName({
                            channelName: user?.attributes?.name!,
                          })
                        );
                        allMessages = await getUserChannels(
                          `${API_ENDPOINTS.GET_CHANNELS}/${user.id}`
                        );

                        allMessages =
                          allMessages?.data[0]?.attributes?.posts[0]?.rows;
                      }
                      setMessages(allMessages);
                      setIsDrawerOpen(false);
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col    flex-1 h-full overflow-hidden">
              {selectedUser !== null ? (
                <ChatWindow
                  user={selectedUser}
                  allMessages={messages!}
                  channels={channels}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  Select a user to start chatting
                </div>
              )}
            </div>
            <button
              className={`lg:hidden fixed ${selectedUser !== null ? "bottom-28" : "bottom-4"} right-4 bg-[#eaa881] text-white  px-4 py-4 rounded-full`}
              onClick={() => setIsDrawerOpen(true)}
            >
              <svg
                className="relative  cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="19"
                viewBox="0 0 23 19"
                fill="none"
              >
                <rect
                  x="0.400391"
                  width="22.2"
                  height="3.7"
                  rx="1.85"
                  fill="white"
                />
                <rect
                  x="0.400391"
                  y="7.3999"
                  width="22.2"
                  height="3.7"
                  rx="1.85"
                  fill="white"
                />
                <rect
                  x="0.400391"
                  y="14.8"
                  width="22.2"
                  height="3.7"
                  rx="1.85"
                  fill="white"
                />
              </svg>
            </button>
            {isDrawerOpen && (
              <div className="lg:hidden  fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
                <div className="absolute top-0 left-0 md:w-[40%] w-[70%] h-full bg-white p-4 overflow-y-auto">
                  <button
                    className="mb-4 font-bold text-lg"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    X
                  </button>
                  <UserList
                    users={channels}
                    user={selectedUser}
                    directUsers={allUsers}
                    selectUser={async (user) => {
                      if (user) {
                        setSelectedUser(user);
                        let allMessages;
                        if (user?.isUser) {
                          dispatch(
                            addChannelName({
                              channelName: user?.participants?.userId?.nickName!,
                            })
                          );
                          allMessages = await getUserChannels(
                            `${API_ENDPOINTS.GET_CONVERSATIONS}/${user._id}`
                          );
                          allMessages = allMessages?.data[0]?.attributes?.rows;
                        } else {
                          dispatch(
                            addChannelName({
                              channelName: user?.attributes?.name!,
                            })
                          );
                          allMessages = await getUserChannels(
                            `${API_ENDPOINTS.GET_CHANNELS}/${user.id}`
                          );

                          allMessages =
                            allMessages?.data[0]?.attributes?.posts[0]?.rows;
                        }

                        setMessages(allMessages);
                        setIsDrawerOpen(false);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatContent;
