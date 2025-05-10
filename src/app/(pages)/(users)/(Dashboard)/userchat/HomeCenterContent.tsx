"use client";

import React, { useEffect, useRef, useState } from "react";
import Happy from "@/app/components/reuseables/Svgs/feelingToday/Happy";
import Bored from "@/app/components/reuseables/Svgs/feelingToday/Bored";
import Sad from "@/app/components/reuseables/Svgs/feelingToday/Sad";
import Anxious from "@/app/components/reuseables/Svgs/feelingToday/Anxious";
import Angry from "@/app/components/reuseables/Svgs/feelingToday/Angry";
import Stressed from "@/app/components/reuseables/Svgs/feelingToday/Stressed";
import Excited from "@/app/components/reuseables/Svgs/feelingToday/Excited";
import Pain from "@/app/components/reuseables/Svgs/feelingToday/Pain";
import Calm from "@/app/components/reuseables/Svgs/feelingToday/Calm";
import line from "../../../../../../public/assets/images/line.png";
import Image from "next/image";
import ChatDP from "../../../../../../public/assets/images/ChatDP.png";
import specialTreats from "../../../../../../public/assets/images/specialTreats.png";
import Restaurants from "@/app/components/reuseables/Svgs/outingOptions/Restaurants";
import Cafes from "@/app/components/reuseables/Svgs/outingOptions/Cafes";
import Shopping from "@/app/components/reuseables/Svgs/outingOptions/Shopping";
import Bars from "@/app/components/reuseables/Svgs/outingOptions/Bars";
import Movies from "@/app/components/reuseables/Svgs/outingOptions/Movies";
import OutdoorActivity from "@/app/components/reuseables/Svgs/outingOptions/OutdoorActivity";
import Link from "next/link";
import "../../../../globals.css";
import { useRouter, useSearchParams } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
// import ChatWindow from "@/app/(pages)/components/ChatsComponent/ChatWindow";
import Cookies from "js-cookie";

// import ChatWindow, {
//   Message,
// } from "@/app/(pages)/components/ChatsComponent/ChatWindow";
import UserList from "@/app/(pages)/components/ChatsComponent/UserList";
import {
  getUserChannels,
  uploadImage,
} from "@/app/(pages)/components/reuseable/ApiCall";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import type { RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addChannelName } from "@/app/redux/users/profileSlice";
import { LikeButton } from "@/app/(pages)/components/ChatsComponent/LikeButton";
import { ShareButton } from "@/app/(pages)/components/ChatsComponent/ShareButton";
import ReactModal from "react-modal";
import { getCommunityPostById } from "@/app/components/utils/Helper";
import { showMessage } from "@/app/components/reuseables/Notification";
import { selectPlaceDetails } from "@/app/redux/placesSlice";
import moment from "moment";
import getAndDecryptCookie from "@/app/lib/auth";

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
// Define the types for the message and user objects
interface User {
  image?: string;
  nickName?: string;
}

interface Messages {
  _id: string;
  user?: User;
  createdAt: string;
  text?: string;
  file?: string;
  attachment?: string;
  isLiked: boolean;
  likes: number;
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
}

interface ChatWindowProps {
  user: User | null;
  allMessages: Message[];
  channels: User[];
}

interface questionerComment {
  userId: {
    image: string;
    nickName: string;
  };
  text: string;
  createdAt: string;
}

const users = [
  { id: 1, name: "General", profileImg: "/assets/images/profile.png" },
  {
    id: 2,
    name: "Emotional Well-being",
    profileImg: "/assets/images/profile.png",
  },
  {
    id: 3,
    name: "Over-coming Anxiety",
    profileImg: "/assets/images/profile.png",
  },
];
interface Condition2 {
  name: string;
  color: string;
  icon: JSX.Element;
  onclick: () => void;
}
const HomeCenterContent = () => {
  const navigate = useRouter();
  const getMood = secureLocalStorage.getItem("mood");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const chatData = useSelector((state: RootState) => state.sockets.chatData);
  const dispatch = useDispatch();

  const [newMessage, setNewMessage] = useState("");
  const [post, setPost] = useState<any>({});
  // const [updatedUser, setUpdatedUser] = useState<any>(user);
  const [commentMessages, setCommentMessages] = useState<Message[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isMessageBlocked: false,
    isCommunityBlocked: false,
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comments, setComments] = useState([]);
  const [communityDetails, setCommunityDetails] = useState<questionerComment>();

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

  const getTimeFromDate = (time: string) => {
    const date = new Date(time);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const setCreatedAtIfNotPresentDate = (message: any) => {
    if (!message.createdAt) {
      message.createdAt = new Date().toISOString();
    }
    return message;
  };

  const getAllChannels = async () => {
    const allChannels = await getUserChannels(API_ENDPOINTS.GET_CHANNELS);
    setChannels(allChannels?.data);
    const allDirectUsers = await getUserChannels(
      API_ENDPOINTS.GET_CONVERSATIONS
    );
    setAllUsers(allDirectUsers?.data?.attributes?.rows);
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
  const [option, setOption] = useState<string | null>(null);
  useEffect(() => {
    const paramsName = new URLSearchParams(window.location.search).get("name");
    const data = paramsName ? paramsName.replace(/<br\s*\/?>/gi, " ") : "";
    setOption(data);
  }, []);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<String>("");
  const [text, setText] = useState("");

  const handleNavigation = (name: string) => {
    localStorage.setItem("option", name.toLowerCase().replace(" ", ""));
    navigate.push(`/outing-options?name=${encodeURIComponent(name)}`);
  };

  const emotions = [
    { name: "Happy", icon: <Happy /> },
    { name: "Sad", icon: <Sad /> },
    { name: "Angry", icon: <Angry /> },
    { name: "Excited", icon: <Excited /> },
    { name: "Bored", icon: <Bored /> },
    { name: "Anxious", icon: <Anxious /> },
    { name: "Stressed", icon: <Stressed /> },
    { name: "Pain", icon: <Pain /> },
    { name: "Calm", icon: <Calm /> },
  ];

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    secureLocalStorage.setItem("mood", emotion);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault(); // Prevents the default form submission
    handleNavigation(text); // Calls your handleNavigation function with the current input value
  };
  const handleSVGClick = () => {
    fileInputRef.current?.click();
  };
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const questionId = searchParams.get("id");
  const QuestionerImage = searchParams.get("Questionerimage");
  const OutingName = searchParams.get("OutingName");
  const questionerName = searchParams.get("questionerName");
  const onCommentClick = async () => {
    const allMessages = await getUserChannels(
      `${API_ENDPOINTS.GET_COMMENTS}/${questionId}`
    );
    setOpenModal(true);
    setCommentMessages(allMessages?.data[0]?.attributes?.comments);
    setPost(allMessages?.data[0]);
  };

  useEffect(() => {
    const getCommunityPost = async () => {
      await getCommunityPostById(questionId ?? "")
        .then((res) => {
          setCommunityDetails(res);
          setComments(res?.comments);
        })
        .catch((err) => {
          showMessage(err?.error[0]?.title, "error");
        });
    };
    getCommunityPost();
  }, []);

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

  const sendComment = async (e: any) => {
    e.preventDefault();
    const userData: { nickName: string; image: string } = JSON.parse(data!);

    if (!image) {
      if (newMessage === "") return;
    }

    const userId = getAndDecryptCookie("Id");
    let file;

    if (image) {
      file = await uploadImage(image);
    }
    const messageSent = {
      _id: generateHexId(24),
      text: newMessage,
      file: file?.data?.attributes?.link,
      type: file?.data?.attributes?.type ? file?.data?.attributes?.type : null,
      postId: { _id: post?.id },
      userId: { _id: userId },
      user: { nickName: userData?.nickName, image: userData?.image },
    };
    //@ts-ignore
    setComments((prev: any) => [...prev, messageSent]);
    setNewMessage("");
    setImage(null);
    setPreviewSrc(null);

    socket?.emit("sendComment", messageSent);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, comments]);

  useEffect(() => {
    onCommentClick();
  }, []);

  const placeDetails = useSelector(selectPlaceDetails);

  function capitalizeFirstLetterOfEachWord(name: string) {
    return name.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  const formattedPlaceName = capitalizeFirstLetterOfEachWord(
    placeDetails?.name
  );

  return (
    <div className="w-full ">
      <div className="max-sm:mt-20  mt-8">
        <div className="flex flex-col w-full ">
          <div className=" max-lg:h-[50svh] lg:h-[80svh] relative bg-[#f5f5f5]">
            <div
              className="flex flex-col h-full bg-[#f5f5f5] rounded-xl"
              ref={modalRef}
            >
              <div className="h-[50svh] 2xl:h-svh overflow-auto rounded-t-xl">
                <div className="flex mb-2 px-[34px] ">
                  <Image
                    className="w-10 h-10 rounded-[10px]"
                    width={10}
                    height={10}
                    src={
                      communityDetails?.userId?.image! &&
                      communityDetails?.userId?.image
                    }
                    unoptimized
                    alt="likeIcon"
                  />
                  <div className="flex-1 ps-3">
                    <span className="font-montserrat text-xl font-bold leading-normal">
                      {communityDetails?.userId?.nickName}
                    </span>
                    <span className="font-montserrat text-[8px] font-normal leading-normal ps-4">
                      {getTimeFromDate(communityDetails?.createdAt ?? "")}
                    </span>

                    <div>
                      <p className="font-montserrat text-black text-[15px] font-medium leading-normal">
                        {communityDetails?.text}
                      </p>
                    </div>

                    <div>
                      <p className="capitalize text-blue-400 py-2">
                        {formattedPlaceName}
                      </p>
                    </div>
                  </div>
                </div>

                {comments?.map((message: Messages, index: number) => {
                  const updatedMessage = setCreatedAtIfNotPresentDate(message);

                  return (
                    <div
                      key={message?._id}
                      className=" border-t border-black relative"
                    >
                      <div className="">
                        <div
                          style={{
                            backgroundColor: colors[index % colors.length],
                            paddingInline: 20,
                            alignItems: "center",
                            borderRadius: 50,
                            // height: 17,
                            justifyContent: "center",
                            position: "absolute",
                            right: 0,
                            top: -12,
                          }}
                        >
                          <div className="flex justify-center items-center ">
                            {moment(message?.createdAt).format("MMM Do")}
                          </div>
                        </div>
                      </div>
                      <div className="-b -black me-2 "></div>
                      <div className="px-[34px] flex justify-between items-center py-5 ">
                        <div className="flex flex-1 ps-3">
                          <Image
                            className="w-10 h-10 rounded-[10px] mr-2"
                            width={10}
                            height={10}
                            src={message?.user?.image! && message?.user?.image!}
                            unoptimized
                            alt="likeIcon"
                          />
                          <div>
                            <span className="font-montserrat text-xl font-bold leading-normal">
                              {message?.user?.nickName}
                            </span>
                            <span className="font-montserrat text-[8px] font-normal leading-normal ps-4">
                              {getTimeFromDate(message?.createdAt)}
                            </span>

                            <div className="py-3">
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
                              ) : message?.attachment ? (
                                <Image
                                  width={100}
                                  height={100}
                                  src={message?.attachment}
                                  alt="Selected file"
                                  style={{ width: "160px", maxWidth: "160px" }}
                                  unoptimized
                                />
                              ) : (
                                ""
                              )}
                            </div>
                            <div>
                              <LikeButton
                                data={{
                                  id: message?._id,
                                  user: message?.isLiked,
                                  likes: message?.likes,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={sendComment}
                className="pt-7 pb-2 px-7 -t-2 -black flex sticky gap-2 bottom-0 inset-x-0 bg-[#f5f5f5]  rounded-b-xl"
              >
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
                {!userStatus?.isMessageBlocked &&
                  !userStatus?.isCommunityBlocked && (
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
                  className="flex-1 p-2 bg-[#f5f5f5]   font-montserrat text-sm text-black font-normal leading-normal   mr-2"
                  placeholder="Write a comment"
                />

                <div className="pt-4 " onClick={sendComment}>
                  <Image
                    className="cursor-pointer"
                    width={20}
                    height={15}
                    src={"/assets/images/shareIcon.png"}
                    alt="shareIcon"
                    unoptimized
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCenterContent;
