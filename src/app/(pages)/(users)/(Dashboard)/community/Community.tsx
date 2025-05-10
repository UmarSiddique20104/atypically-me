"use client";
import React, { useEffect, useState } from "react";

import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
import line2 from "../../../../../../public/assets/images/line2.png";
import "../../../../globals.css";
import Link from "next/link";
import Image from "next/image";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { getUserChannels } from "@/app/(pages)/components/reuseable/ApiCall";
import { addChatData } from "@/app/redux/users/userChat";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addChannelName } from "@/app/redux/users/profileSlice";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";
export type User = {
  id: number;
  _id?: number;
  attributes?: {
    name: string;
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

const Community = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isChannelsOpen, setIsChannelsOpen] = useState(true);
  const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState(true);
  const [channels, setChannels] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const dispatch = useDispatch();
  const { push } = useRouter();
  useTokenRedirect();

  const toggleChannels = () => {
    setIsChannelsOpen(!isChannelsOpen);
  };

  const toggleDirectMessages = () => {
    setIsDirectMessagesOpen(!isDirectMessagesOpen);
  };

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
  }, []);

  const selectUser = async (user: User) => {
    if (user) {
      dispatch(
        addChannelName({
          channelName: user?.participants?.userId?.nickName!,
        })
      );

      dispatch(addChatData(user));
      console.log('user', user)
      push(`/chats?userId=${user?._id ? user?._id : user?.id}`);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}

      <div className="flex min-h-screen bg-primary">
        <div className="flex flex-col w-full">
          <div className="fixed z-40 md:top-0 top-0 w-full">
            <MainHeader
              title="Community"
              subtitle=""
              goto="/home"
              bg="green"
              font="24px"
              paddding={true}
            />
          </div>
          <div className=" mt-5 pt-52 h-svh overflow-x-hidden  no-scrollbar">
            <div
              className="flex justify-between items-center cursor-pointer   max-lg:px-2 px-16 text-2xl ml-28 md:ml-ml-28 max-sm:ml-0 md:pr-[4rem]  pr-4 "
              onClick={toggleChannels}
            >
              <h1 className="font-montserrat font-extrabold leading-normal">
                Channels
              </h1>
              {isChannelsOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="9"
                  viewBox="0 0 11 9"
                  fill="none"
                >
                  <path
                    d="M6.08112 0.50029L10.7576 6.29313C11.0808 6.69351 11.0808 7.34095 10.7576 7.73708L9.98046 8.69971C9.65724 9.1001 9.13457 9.1001 8.81479 8.69971L5.5 4.59361L2.18521 8.69971C1.86199 9.1001 1.33932 9.1001 1.01954 8.69971L0.242418 7.73708C-0.0808078 7.33669 -0.0808079 6.68926 0.242418 6.29313L4.91888 0.50029C5.23523 0.0999027 5.75789 0.0999026 6.08112 0.50029Z"
                    fill="black"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="9"
                  viewBox="0 0 11 9"
                  fill="none"
                >
                  <path
                    d="M4.91888 8.49971L0.242419 2.70687C-0.0808069 2.30649 -0.0808068 1.65905 0.242419 1.26292L1.01954 0.300291C1.34276 -0.100097 1.86543 -0.100096 2.18521 0.300291L5.5 4.40639L8.81479 0.300292C9.13801 -0.100095 9.66068 -0.100095 9.98046 0.300292L10.7576 1.26293C11.0808 1.66331 11.0808 2.31075 10.7576 2.70688L6.08112 8.49971C5.76477 8.9001 5.24211 8.9001 4.91888 8.49971Z"
                    fill="black"
                  />
                </svg>
              )}
            </div>
            <div className="border-t-4 border-black border-dotted mt-5 max-sm:ms-0 ms-[6%] pe-[23px]"></div>
            {isChannelsOpen && (
              <div
                className={`${isChannelsOpen
                  ? "max-h-96 transition-all ease-in-out duration-300 overflow-x-hidden overflow-y-auto no-scrollbar"
                  : "max-h-0 overflow-x-hidden overflow-y-auto no-scrollbar"
                  }  pt-8 max-lg:px-2 px-16 ml-28 md:ml-ml-28 max-sm:ml-0  md:pr-[4rem]  pr-4 `}
              >
                {channels?.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center p-4 max-sm:ps-[10px] cursor-pointer hover:bg-gray-200 "
                    onClick={() => selectUser(channel)}
                  >
                    <span>{channel?.attributes?.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={isChannelsOpen ? `pt-6` : "pt-12"}>
              <div
                className="flex justify-between items-center  max-lg:px-2 px-16 text-2xl ml-28 md:ml-ml-28 max-sm:ml-0 md:pr-[4rem] cursor-pointer pr-4 "
                onClick={toggleDirectMessages}
              >
                <h1 className="font-montserrat font-extrabold leading-normal">
                  Direct messages
                </h1>
                {isDirectMessagesOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="9"
                    viewBox="0 0 11 9"
                    fill="none"
                  >
                    <path
                      d="M6.08112 0.50029L10.7576 6.29313C11.0808 6.69351 11.0808 7.34095 10.7576 7.73708L9.98046 8.69971C9.65724 9.1001 9.13457 9.1001 8.81479 8.69971L5.5 4.59361L2.18521 8.69971C1.86199 9.1001 1.33932 9.1001 1.01954 8.69971L0.242418 7.73708C-0.0808078 7.33669 -0.0808079 6.68926 0.242418 6.29313L4.91888 0.50029C5.23523 0.0999027 5.75789 0.0999026 6.08112 0.50029Z"
                      fill="black"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="9"
                    viewBox="0 0 11 9"
                    fill="none"
                  >
                    <path
                      d="M4.91888 8.49971L0.242419 2.70687C-0.0808069 2.30649 -0.0808068 1.65905 0.242419 1.26292L1.01954 0.300291C1.34276 -0.100097 1.86543 -0.100096 2.18521 0.300291L5.5 4.40639L8.81479 0.300292C9.13801 -0.100095 9.66068 -0.100095 9.98046 0.300292L10.7576 1.26293C11.0808 1.66331 11.0808 2.31075 10.7576 2.70688L6.08112 8.49971C5.76477 8.9001 5.24211 8.9001 4.91888 8.49971Z"
                      fill="black"
                    />
                  </svg>
                )}
              </div>
              <div className="border-t-4 border-black border-dotted mt-5 max-sm:ms-0 ms-[6%] pe-[23px]"></div>
              {isDirectMessagesOpen && (
                <div
                  className={`${isDirectMessagesOpen
                    ? "max-h-96 transition-all ease-in-out duration-300 overflow-y-auto"
                    : "max-h-0 overflow-hidden"
                    }  pt-8 max-lg:px-2 px-16 ml-28 md:ml-ml-28 max-sm:ml-0  md:pr-[4rem]  pr-4 `}
                >
                  {allUsers?.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center p-4 max-sm:ps-[10px] cursor-pointer hover:bg-gray-200 md:pr-[4rem]  pr-4 "
                      onClick={() => selectUser({ isUser: true, ...user })}
                    >
                      <Image
                        className="w-12 h-12 rounded-full mr-4"
                        width={12}
                        height={12}
                        src={user?.participants?.userId?.image!}
                        alt="profileImg"
                        unoptimized
                      />
                      <span>{user?.participants?.userId?.nickName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={isChannelsOpen ? `pb-10` : "pt-12"}>
              <Link href={"/add-a-friend"}>
                <div className="border-t-4 border-black border-dotted mt-5 max-sm:ms-0 ms-[6%] pe-[23px]"></div>
                <h1 className="font-montserrat cursor-pointer font-extrabold leading-normal max-lg:px-2 px-16 text-2xl ml-28 md:ml-28 max-sm:ml-0 md:pr-[4rem]  pr-4 pt-8">
                  +Add a Friend
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
