import getAndDecryptCookie from "@/app/lib/auth";
import type { RootState } from "@/app/redux/store";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import {
  getUserChannels,
  likeMessage,
  uploadImage,
} from "../reuseable/ApiCall";
import { LikeButton } from "./LikeButton";
import { ShareButton } from "./ShareButton";
import Modal from "react-modal";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import Noimg from "../../../../../public/assets/images/noimgpic.jpeg";
import { useRouter } from "next/navigation";
import { showMessage } from "@/app/components/reuseables/Notification";
import { ProfileData } from "@/types/types";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import moment from "moment";
import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
interface User {
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
}

interface UserStatus {
  isMessageBlocked: boolean;
  isCommunityBlocked: boolean;
}
export interface Message {
  _id?: string;
  id: number;
  user: {
    image: string;
    nickName: string;
    _id: string;
  };
  receiver: {
    nickName: string;
  };
  sender: {
    image: string;
    nickName: string;
  };
  text: string;
  timestamp: string;
  data: [
    {
      attributes: {
        rows: { text: string }[];
      };
    }
  ];
  createdAt: string;
  file: string;
  type: string;
  attachment?: string;
  likes?: number;
  shares?: number;
  comments?: number;
  userId?: {
    image: string;
    nickName: string;
  };
}

interface ChatWindowProps {
  user: User | null;
  allMessages: Message[];
  channels: User[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  user,
  allMessages,
  channels,
}) => {
  const [messages, setMessages] = useState<Message[]>(allMessages);
  const [newMessage, setNewMessage] = useState("");
  const [newMessageComment, setNewMessageComment] = useState("");

  const [post, setPost] = useState<any>({});
  const [updatedUser, setUpdatedUser] = useState<any>(user);
  const [commentMessages, setCommentMessages] = useState<Message[]>([]);
  const [createdTime, setCreatedTime] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewSrc2, setPreviewSrc2] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isMessageBlocked: false,
    isCommunityBlocked: false,
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const socket = useSelector((state: RootState) => state.sockets.socket);
  const data = Cookies.get("userProfileData");
  const generateHexId = (length: number) => {
    const characters = "abcdef0123456789";
    const charactersLength = characters.length;
    let hexId = "";
    for (let i = 0; i < length; i++) {
      hexId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return hexId;
  };
  console.log('channels', channels)
  const sendMessage = async (e: any) => {
    e.preventDefault();
    const userData: { nickName: string; image: string } = JSON.parse(data!);
    if (!image) {
      if (newMessage === "") return;
    }
    // if ((!image || newMessage.trim() === "") && !user) return;

    const userId = getAndDecryptCookie("Id");
    let file;
    if (image) {
      file = await uploadImage(image);
    }
    let messageSent;
    if (user?.isUser) {
      messageSent = {
        _id: generateHexId(24),
        text: newMessage,
        file: file?.data?.attributes?.link,
        type: file?.data?.attributes?.type,
        receiver: { _id: user?.participants?.userId?._id },
        sender: { _id: userId },
        user: { nickName: userData?.nickName, image: userData?.image },
        likes: 0,
      };
      socket?.emit("sendMessage", messageSent);
    } else {
      messageSent = {
        _id: generateHexId(24),
        text: newMessage,
        file: file?.data?.attributes?.link,
        type: file?.data?.attributes?.type,
        channelId: { _id: user?.id },
        userId: { _id: userId },
        user: { nickName: userData?.nickName, image: userData?.image },
      };
      socket?.emit("sendPost", messageSent);
    }
    // setMessages((prev: any) => [...prev, messageSent]);
    setMessages((prev: any) =>
      Array.isArray(prev) ? [...prev, messageSent] : [messageSent]
    );

    setNewMessage("");
    setImage(null);
    setPreviewSrc(null);
  };
  useEffect(() => {
    setMessages(allMessages);
  }, [allMessages]);

  useEffect(() => {
    setUpdatedUser(user);
    if (user?.participants?.userId?._id) {
      localStorage.setItem("rId", user?.participants?.userId?._id!);
    } else {
      localStorage.setItem("rId", user?.id?.toString()!);
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, commentMessages]);

  useEffect(() => {
    socket?.on("receiveMessage", (data) => {
      console.log('receive message')
      console.log('dataSOCKETS', data)
      if (data && localStorage.getItem("rId") == data?.sender?._id) {
        const messageRecieve = {
          _id: data?._id,
          text: data.text,
          createdAt: data.createdAt,
          file: data?.file,
          user: {
            _id: data?.sender?._id,
            nickName: data?.sender?.nickName,
            image: data?.sender?.image,
          },
        };
        // setMessages((prev: any) => [...prev, messageRecieve]);
        setMessages((prev: any) =>
          Array.isArray(prev) ? [...prev, messageRecieve] : [messageRecieve]
        );
      }
    });
    socket?.on("receivePost", (data) => {
      if (data) {
        const messageRecieve = {
          _id: data?._id,
          text: data.text,
          createdAt: data.createdAt,
          file: data?.attachment,
          user: {
            _id: data?.user?._id,
            nickName: data?.user?.nickName,
            image: data?.user?.image,
          },
        };
        // setMessages((prev: any) => [...prev, messageRecieve]);
        setMessages((prev: any) =>
          Array.isArray(prev) ? [...prev, messageRecieve] : [messageRecieve]
        );
      }
    });
    socket?.on("receiveComment", (data) => {
      if (data) {
        const messageRecieve = {
          _id: data?._id,
          text: data.text,
          createdAt: data.createdAt,
          attachment: data?.attachment,
          user: {
            _id: data?.userId?._id,
            nickName: data?.userId?.nickName,
            image: data?.userId?.image,
          },
        };

        setCommentMessages((prev: any) => [...prev, messageRecieve]);
      }
    });
    console.log('workingCHat', socket);

    socket?.on("notificationCount", (count) => {
      console.log('notificationCount', count)

    });

  }, [socket]);

  const getTimeFromDate = (time: string): string => {
    const date = new Date(time);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const setCreatedAtIfNotPresent = (message: Message): string => {
    if (!message?.createdAt) {
      message.createdAt = new Date().toISOString();
    }
    return getTimeFromDate(message?.createdAt);
  };
  const setCreatedAtIfNotPresentDate = (message: any) => {
    if (!message.createdAt) {
      message.createdAt = new Date().toISOString(); // Set to current date and time in ISO format
    }
    return message;
  };

  const handleSVGClick = () => {
    fileInputRef.current?.click();
  };
  const handleSVGClick2 = () => {
    fileInputRef2.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc2(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCommentClick = async (id: string | undefined) => {
    const allMessages = await getUserChannels(
      `${API_ENDPOINTS.GET_COMMENTS}/${id}`
    );
    setOpenModal(true);
    setCommentMessages(allMessages?.data[0]?.attributes?.comments);
    setPost(allMessages?.data[0]);

  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewMessage("");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);

  const sendComment = async (e: any) => {
    e.preventDefault()
    const userData: { nickName: string; image: string } = JSON.parse(data!);
    if (!image) {
      if (newMessageComment === "") return;
    }
    const userId = getAndDecryptCookie("Id");
    let file;
    if (image) {
      file = await uploadImage(image);
    }
    const messageSent = {
      _id: generateHexId(24),
      text: newMessageComment,
      file: file?.data?.attributes?.link,
      type: file?.data?.attributes?.type,
      postId: { _id: post?.id },
      userId: { _id: userId },
      user: { nickName: userData?.nickName, image: userData?.image },
    };

    socket?.emit("sendComment", messageSent);
    setCommentMessages((prev: any) => [...prev, messageSent]);
    setNewMessageComment("");
    setPreviewSrc2(null)
    setImage(null)

  };

  const proData = useSelector(
    (state: RootState) => state?.userProfile
  ) as ProfileData;
  const colors = [
    "#DDCAED",
    "#ECD260",
    "#9AAAC9",
    "#C2B6D1",
    "#B5C9A5",
    "#EBBFA4",
    "#9AAAC9",
    "#BCD1EF",
  ];

  const router = useRouter();

  const handleClick = (message: any) => {
    const nickname = message?.user?.nickName;
    const nickNameReceiver = message?.receiver?.nickName;

    if (!nickname && !nickNameReceiver) {
      return showMessage("User does not have a nickname", "error");
    } else if (
      nickname === proData?.nickName ||
      nickNameReceiver === proData?.nickName
    ) {
      router.push("profile");
    } else {
      const name = nickname || nickNameReceiver;
      router.push(`/user-profile?name=${encodeURIComponent(name)}`);
    }
  };
  const token = getAndDecryptCookie("AccessToken");

  const getProfileData = async () => {
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GET_USER_PROFILE}`;

    try {
      const result = await fetchApi(url, requestOptions);
      const { attributes } = result?.data[0];
      setUserStatus(attributes);
    } catch (error) {
      console.error("GetDeals error:", error);
    }
  };

  useEffect(() => {

    getProfileData();
  }, []);

  return (
    <div className="h-full  relative bg-[#f5f5f5]">
      <div className="flex flex-col h-full">
        <div className="overflow-hidden flex-1">
          <div className="h-full overflow-x-hidden pt-4 overflow-y-auto">
            {messages?.map((message, index) => {
              const updatedMessage = setCreatedAtIfNotPresentDate(message);
              return (
                <div
                  key={message?.id}
                  className="px-[34px] max-[500px]:px-[20px] relative w-full py-7  border-1 border-t border-black"
                >
                  <div className="flex mb-2 ">
                    <div className="">
                      <div
                        style={{
                          backgroundColor: colors[index % colors.length],
                          alignItems: "center",
                          borderRadius: 50,
                          paddingInline: 20,
                          justifyContent: "center",
                          position: "absolute",
                          right: 0,
                          top: -12,
                        }}
                      >
                        <div className="flex justify-center items-center">
                          {moment(updatedMessage?.createdAt).format("MMM Do")}
                        </div>
                      </div>
                    </div>
                    <Image
                      onClick={() => handleClick(message)}
                      className="w-10 h-10 rounded-[10px] mr-2 cursor-pointer"
                      width={10}
                      height={10}
                      src={
                        message?.sender?.image
                          ? message?.user?.nickName === proData?.nickName
                            ? proData?.image
                            : message?.sender?.image
                          : message?.user?.image
                            ? message?.user?.image
                            : Noimg
                      }
                      unoptimized
                      alt="likeIcon"
                    />
                    <div className="flex-1 ps-3">
                      <div className="flex justify-between w-full pb-4">
                        <div>
                          <span className="font-montserrat text-xl max-[500px]:text-[14px]  font-bold leading-normal">
                            {message?.user?.nickName
                              ? message?.user?.nickName
                              : message?.sender?.nickName}
                          </span>
                          <span className="font-montserrat text-[8px] font-normal leading-normal ps-4">
                            {getTimeFromDate(message?.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-10 max-[500px]:gap-4 text-gray-500 relative">
                          <LikeButton
                            data={{
                              id: message?._id,
                              user: user?.isUser,
                              likes: message?.likes,
                              message: message,
                            }}
                          />
                          <ShareButton
                            channels={channels}
                            data={{
                              id: String(message?._id),
                              channelId: user?.id,
                              user: user?.isUser,
                              shares: message?.shares,
                            }}
                          />
                          {!user?.isUser ? (
                            <span className="cursor-pointer flex gap-x-1">
                              <Image
                                width={20}
                                height={20}
                                src="/assets/images/messageIcon.png"
                                alt="messageIcon"
                                className="h-5"
                                onClick={() => onCommentClick(message._id)}
                                unoptimized
                              />{" "}
                              <span>{message?.comments}</span>
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="font-montserrat text-black text-[15px] font-medium leading-normal">
                          {message?.text}
                        </p>
                        {message?.file ? (
                          <Image
                            width={100}
                            height={100}
                            src={message?.file}
                            alt="Selected file"
                            style={{ width: "160px", maxWidth: "160px" }}
                            unoptimized
                          />
                        ) : (
                          message?.attachment && (
                            <Image
                              width={100}
                              height={100}
                              src={message?.attachment ?? ""}
                              alt="Selected file"
                              style={{ width: "160px", maxWidth: "160px" }}
                              unoptimized
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </div>
        <div className="py-7 px-8 border-t-2  border-black flex justify-center sticky gap-2 bottom-0 inset-x-0 bg-[#f5f5f5]">
          {previewSrc && (
            <div className="w-[40px] max-w-[80px] max-h-[80px] h-[40px] ">
              <Image
                width={80}
                height={80}
                src={previewSrc}
                alt="Selected file"
                className=" object-cover w-[50px] h-[50px]"
                unoptimized
              // style={{ width: "80px ", maxWidth: "80px " }}
              />
            </div>
          )}
          {!userStatus?.isMessageBlocked && !userStatus?.isCommunityBlocked && (
            <svg
              onClick={handleSVGClick}
              width="51"
              height="51"
              viewBox="0 0 51 51"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ cursor: "pointer" }}
            >
              <circle cx="25.5" cy="25.5" r="25.5" fill="#D9D9D9" />
              <path
                d="M32.0967 21.9704V25.0056H27.7679V29.2348H24.5586V25.0056H20.2547V21.9704H24.5586V17.7412H27.7679V21.9704H32.0967Z"
                fill="black"
              />
            </svg>
          )}

          <form onSubmit={sendMessage} className=" flex w-full">
            {userStatus?.isMessageBlocked ||
              (!userStatus?.isCommunityBlocked && (
                <input
                  accept="image/*"
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              ))}

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2   font-montserrat text-sm text-black font-normal leading-normal bg-primary  border-none mr-2"
              disabled={
                userStatus?.isMessageBlocked || userStatus?.isCommunityBlocked
              }
              placeholder={
                userStatus?.isMessageBlocked || userStatus?.isCommunityBlocked
                  ? "You can't send a message to this Chat."
                  : "Write a message"
              }
            />

            {!userStatus?.isMessageBlocked &&
              !userStatus?.isCommunityBlocked && (
                <div className="pt-4 " onClick={sendMessage}>
                  <Image
                    className="cursor-pointer"
                    width={20}
                    height={15}
                    src={"/assets/images/shareIcon.png"}
                    alt="shareIcon"
                    unoptimized
                  />
                </div>
              )}
          </form>
        </div>
      </div>
      {openModal && (
        <div className="h-full w-full fixed top-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="w-full lg:max-w-2xl md:max-w-xl lg:h-[90vh] md:h-[80vh]  sm:max-w-lg  max-w-sm sm:h-[70vh] h-[65vh] bg-white rounded-xl overflow-hidden flex flex-col"
            ref={modalRef}
          >
            <div className="flex-none bg-purple py-6 px-6 sticky top-0 flex items-center justify-center">
              <h3 className="text-center text-lg font-medium text-black flex gap-x-2 m-auto items-center justify-center">
                {post?.attributes?.userId?.nickName} :{" "}
                {!post?.attributes?.attachment ? (
                  post?.attributes?.text
                ) : (
                  <Image
                    className="w-16 h-16 rounded-[10px] mr-2"
                    width={40}
                    height={40}
                    src={post?.attributes?.attachment}
                    alt="likeIcon"
                    unoptimized
                  />
                )}
              </h3>
            </div>
            <div className="flex-1 no-scrollbar overflow-y-auto p-4">
              {commentMessages?.map((message, index) => (
                <div
                  key={message?.id}
                  className=" py-3 bg-white flex justify-between items-center border-t  border-black"
                >
                  <div className="flex mb-2 w-full">
                    <Image
                      className="w-10 h-10 rounded-[10px] mr-2"
                      width={40}
                      height={40}
                      src={
                        user?.isUser
                          ? user?.participants?.userId?.image!
                          : message?.user?.image
                      }
                      unoptimized
                      alt="likeIcon"
                    />
                    <div className="flex-1 ps-3">
                      <span className="font-montserrat text-xl font-bold leading-normal">
                        {message?.user?.nickName}
                      </span>
                      <span className="font-montserrat text-[8px] font-normal leading-normal ps-4">
                        {setCreatedAtIfNotPresent(message)}
                      </span>
                      <div>
                        <p className="font-montserrat text-black text-[15px] font-medium leading-normal">
                          {message?.text}
                        </p>
                        {message?.file ? (
                          <Image
                            width={100}
                            height={100}
                            src={message?.file}
                            alt="Selected file"
                            style={{ width: "160px", maxWidth: "160px" }}
                            unoptimized
                          />
                        ) : (
                          message?.attachment && (
                            <Image
                              width={100}
                              height={100}
                              src={message?.attachment ?? ""}
                              alt="Selected file"
                              style={{ width: "160px", maxWidth: "160px" }}
                              unoptimized
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>







            <div className="flex gap-x-4 py-4 px-6 border-t-2 border-black bg-white">
              {previewSrc2 && (
                <div className="w-[40px] max-w-[80px] max-h-[80px] h-[40px] ">
                  <Image
                    width={80}
                    height={80}
                    src={previewSrc2}
                    alt="Selected file"
                    className=" object-cover w-[50px] h-[50px]"
                    unoptimized
                  // style={{ width: "80px ", maxWidth: "80px " }}
                  />
                </div>
              )}
              <svg
                onClick={handleSVGClick2}
                width="51"
                height="51"
                viewBox="0 0 51 51"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ cursor: "pointer" }}
              >
                <circle cx="25.5" cy="25.5" r="25.5" fill="#D9D9D9" />
                <path
                  d="M32.0967 21.9704V25.0056H27.7679V29.2348H24.5586V25.0056H20.2547V21.9704H24.5586V17.7412H27.7679V21.9704H32.0967Z"
                  fill="black"
                />
              </svg>
              <form onSubmit={sendComment} className="flex gap-2 w-[80%]">
                <input
                  accept="image/*"
                  type="file"
                  ref={fileInputRef2}
                  style={{ display: "none" }}
                  onChange={handleFileChange2}
                />
                <input
                  type="text"
                  value={newMessageComment}
                  onChange={(e) => setNewMessageComment(e.target.value)}
                  className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm"
                  placeholder="Write a comment"
                />
                <div className="flex items-center">
                  <Image
                    className="cursor-pointer"
                    width={20}
                    height={15}
                    src={"/assets/images/shareIcon.png"}
                    alt="shareIcon"
                    unoptimized
                    onClick={sendComment}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;