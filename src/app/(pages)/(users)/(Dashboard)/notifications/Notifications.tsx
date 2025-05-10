"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import moment from "moment";
import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
import Cookies from "js-cookie";
import "../../../../globals.css";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { showMessage } from "@/app/components/reuseables/Notification";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import getAndDecryptCookie from "@/app/lib/auth";
import Modal from "react-modal";
import {
  getUserChannels,
  uploadImage,
} from "@/app/(pages)/components/reuseable/ApiCall";
import type { Message } from "@/app/(pages)/components/ChatsComponent/ChatWindow";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";

interface Notification {
  type: string;
  _id: string;
  isRead: boolean;
  createdAt: string;
  description: string;
  userId: {
    nickName: string;
    image?: string;
  };
}

interface Notification {
  type: string;
  createdAt: string;
  description: string;
  userId: {
    nickName: string;
    image?: string;
  };
  requestId?: string; // Add this line to match the usage in handleNotification
  postId?: string;
}

interface GroupedNotification {
  title: string;
  data: Notification[];
}

interface UserDetails {
  requestId?: string;
  firstName: string;
  nickName?: string;
  userId?: string;
  image?: string;
  email: string;
  errorStatus?: string;
}
const defaultUserDetails: UserDetails = {
  requestId: "",
  firstName: "",
  nickName: "",
  userId: "",
  image: "",
  email: "",
  errorStatus: "",
};

const Notifications: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = getAndDecryptCookie("AccessToken");
  const [groupedNotifications, setGroupedNotifications] = useState<
    GroupedNotification[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetails, setUserDetail] = useState<any>(defaultUserDetails);
  const [getModal, setModal] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [commentMessages, setCommentMessages] = useState<Message[]>([]);
  const [post, setPost] = useState<any>({});
  const [newMessage, setNewMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notifications, setNotifications] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const [image, setImage] = useState<File | null>(null);
  const socket = useSelector((state: RootState) => state.sockets.socket);
  const data = Cookies.get("userProfileData");

  const modalRef1 = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      //@ts-ignore
      if (modalRef1.current && !modalRef1.current.contains(event.target)) {
        setIsModalOpen(false); // Close the modal if clicked outside
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, setIsModalOpen]);

  useTokenRedirect();
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

  const handleSVGClick = () => {
    fileInputRef.current?.click();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClosePostModal = () => {
    setOpenModal(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClosePostModal();
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

  const GetNotifications = async (pageNumber: any, limit: number = 10) => {
    console.log("notificationRuunig");
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GETNOTI}?pageNumber=${pageNumber}&limit=${limit}`;

    try {
      const result = await fetchApi(url, requestOptions);
      console.log("result", result);

      // Process API response
      handleApiResponse(result);
      window.scrollTo(0, 0);
      // Ensure unique notifications by using a Set or another mechanism
      //@ts-ignore
      setNotifications((prev) => {
        const newNotifications = result.data[0].attributes.rows;
        const allNotifications = [...prev, ...newNotifications];
        // Optionally remove duplicates if necessary
        const uniqueNotifications = Array.from(
          new Set(allNotifications.map((n) => n._id))
        ).map((id) => {
          return allNotifications.find((n) => n._id === id);
        });
        return uniqueNotifications;
      });

      setIsLoading(false);
    } catch (error) {
      console.error("GetNotifications error:", error);
      setIsLoading(false);
    }
  };

  // Ensure handleApiResponse is declared properly
  const handleApiResponse = (result: any) => {
    const temp: Notification[] = result?.data[0]?.attributes?.rows.map(
      (item: any) => ({
        createdAt: item.createdAt,
        ...item,
      })
    );

    const grouped: { [key: string]: Notification[] } = {};
    temp.forEach((data) => {
      const date = moment(data?.createdAt).format("DD-MMM-YYYY");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(data);
    });

    const sortedNotifications = Object.entries(grouped).sort((a, b) => {
      const dateA = moment(a[0], "DD-MMM-YYYY").toDate().getTime();
      const dateB = moment(b[0], "DD-MMM-YYYY").toDate().getTime();
      return dateB - dateA;
    });

    setGroupedNotifications(
      sortedNotifications.map((data) => ({
        title: data[0],
        data: data[1],
      }))
    );
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1 &&
      !isLoading
    ) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  useEffect(() => {
    GetNotifications(pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    socket?.on("receiveCo mment", (data) => {
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

    socket?.on("notificationCount", (count) => {
      GetNotifications(pageNumber);
      console.log("notificationCount", count);
    });
  }, [socket,notifications]);

  const handleNotification = (notification: Notification, email: string) => {
    if (notification?.type === "request") {
      setUserDetail({
        firstName: notification?.userId.nickName,
        image: notification?.userId.image,
        email: email,
        requestId: notification?.requestId,
      });
      setModal(true);
    }
  };
  const getRequestDetails = async (item: any) => {
    // setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.FRIEND_REQUEST}/${item?.requestId}`;

    try {
      const response = await fetchApi(url, requestOptions);
      if (
        response.data.type === "friendRequests" &&
        response.data.attributes.status === "pending"
      ) {
        handleNotification(item, response.data.attributes?.senderId?.email);
        setIsModalOpen(true);
        setIsLoading(false);
      } else {
        setIsModalOpen(true);
        setUserDetail({ errorStatus: response.data.attributes.status });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("GetDeals error:", error);
      setIsLoading(false);
    }
  };

  const handleFriendRequest = async (action: any, requestId: any) => {
    setIsLoading(true);
    const accept = action === "accept" ? true : false;
    accept ? setIsAccepting(true) : setIsRejecting(true);
    setIsLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      data: {
        attributes: {
          status: action,
        },
      },
    });

    const requestOptions: RequestInit = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(`${API_ENDPOINTS.FRIEND_REQUEST}/${requestId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false);
        setIsModalOpen(false);
        if (accept) {
          setIsAccepting(false);
          showMessage("Friend request accepted successfully");
        } else {
          setIsRejecting(false);
          showMessage("Friend request rejeted successfully");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setIsModalOpen(false);
        accept ? setIsAccepting(false) : setIsRejecting(false);
        console.error(error);
      });
  };
  const handleUnReadStatus = async (userId: any) => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      data: {
        attributes: {
          postId: userId,
        },
      },
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(`${API_ENDPOINTS.GETNOTI}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("result", result);
        GetNotifications(pageNumber);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };
  const handleNotificationClick = async (item: Notification) => {
    console.log("item?._id", item?._id);
    handleUnReadStatus(item?._id);
    if (item?.type === "request") {
      getRequestDetails(item);
    }
    if (item?.type === "post") {
      const allMessages = await getUserChannels(
        `${API_ENDPOINTS.GET_COMMENTS}/${item?.postId}`
      );
      setOpenModal(true);
      let allComments = allMessages?.data[0]?.attributes?.comments;
      allComments.unshift(allMessages?.data[0]?.attributes);
      setCommentMessages(allComments);
      const getPost = allMessages?.data[0]?.attributes;
      delete getPost.comments;
      setPost({ ...item, ...getPost });
    }
  };

  useEffect(() => {
    console.log("working", socket);
    socket?.on("notificationCount", (data) => {
      console.log("notificationCountHome", data);
      // setNotificationCount(data?.count)
    });
  }, [socket]);

  const generateHexId = (length: number) => {
    const characters = "abcdef0123456789";
    const charactersLength = characters.length;
    let hexId = "";
    for (let i = 0; i < length; i++) {
      hexId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return hexId;
  };

  const sendComment = async (e: any) => {
    e.preventDefault();
    const userData: { nickName: string; image: string } = JSON.parse(data!);

    if (newMessage.trim() === "" && !post) return;

    let file;
    if (image) {
      file = await uploadImage(image);
    }
    const messageSent = {
      _id: generateHexId(24),
      text: newMessage,
      file: file?.data?.attributes?.link,
      type: file?.data?.attributes?.type,
      postId: { _id: post?.postId },
      userId: { _id: post?.userId?._id },
      user: { nickName: userData?.nickName, image: userData?.image },
    };

    socket?.emit("sendComment", messageSent);
    setCommentMessages((prev: any) => [...prev, messageSent]);
    setNewMessage("");
    setImage(null);
    setPreviewSrc(null);
  };

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commentMessages]);

  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="flex min-h-screen bg-primary">
        <div className="flex flex-col w-full">
          <MainHeader
            title="Notification"
            subtitle=""
            goto="/home"
            bg="purple"
            font="24px"
            paddding={true}
          />
          <div className="mt-5">
            {groupedNotifications.length > 0 ? (
              groupedNotifications.map((section, index) => {
                const sectionDate = moment(section.title, "DD-MMM-YYYY");
                const currentDate = moment();
                const daysDifference = currentDate.diff(sectionDate, "days");

                let formattedTitle = "";
                if (daysDifference === 0) {
                  formattedTitle = "Today";
                } else if (daysDifference === 1) {
                  formattedTitle = "1 day ago";
                } else {
                  formattedTitle = `${daysDifference} days ago`;
                }

                return (
                  <div key={index} className="section pb-12">
                    <h1 className="font-montserrat pb-2 cursor-pointer font-extrabold leading-normal max-lg:px-2 px-16 text-2xl ml-28 md:ml-28 md:pr-[4rem] pr-4">
                      {formattedTitle}
                    </h1>
                    <div className="border-t border-black"></div>
                    <div className="max-lg:px-2 px-16 ml-28 md:ml-28 max-sm:ml-0 max-sm:ms-[18px] max-sm:pr-[1rem] md:pr-[4rem] pr-4">
                      {section.data.map((item, itemIndex) => {
                        const newItem = { ...item };

                        return (
                          <div
                            onClick={() => handleNotificationClick(newItem)}
                            key={itemIndex}
                            className={`flex cursor-pointer items-center gap-5 !my-5 py-2 px-2 ${
                              !newItem?.isRead
                                ? "bg-[#e5e3e3] rounded-full"
                                : ""
                            }`}
                          >
                            <Image
                              width={40}
                              height={40}
                              src={
                                newItem?.userId?.image
                                  ? newItem.userId.image
                                  : "/assets/images/noProfile.png"
                              }
                              alt="profileAvatar"
                              className="!h-10 w-10 rounded-full"
                              unoptimized
                            />

                            <h1 className="font-montserrat font-medium leading-normal text-xl text-black">
                              <span className="font-montserrat font-bold leading-normal text-xl text-black">
                                {newItem?.userId?.nickName}
                              </span>{" "}
                              {newItem.description}
                              <span className="font-medium leading-normal text-[15px] text-[#2997FD]">
                                {" "}
                                {moment(newItem?.createdAt).fromNow()}
                              </span>
                            </h1>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center font-medium pt-10">
                No notifications available
              </div>
            )}
          </div>
        </div>
        {/* Modal */}

        {isModalOpen && (
          <div className="ModelView">
            <Modal
              isOpen={isModalOpen}
              onRequestClose={handleCloseModal}
              contentLabel="Delete Account Modal"
              className="modal flex justify-center items-center min-h-screen"
              shouldCloseOnOverlayClick={true}
            >
              <div className="flex justify-center items-center" ref={modalRef1}>
                <div
                  
                  className="modal-content bg-primary w-[500px] h-[434px] rounded-[20px] flex flex-col items-center pt-11"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="81"
                    height="80"
                    viewBox="0 0 81 80"
                    fill="none"
                  >
                    <path
                      d="M52.3711 35.8547C48.2876 38.5005 46.9004 44.6588 46.6801 47.3514C45.2249 58.8985 36.5898 56.7274 32.6747 61.3818C28.7596 66.0363 31.0334 72.7387 36.8358 75.6282C49.2889 81.3234 60.7749 80.0693 69.4706 69.8207C77.9715 58.9314 73.5206 45.8939 68.8828 40.6579C65.6995 37.0639 58.3409 31.9867 52.3711 35.8547Z"
                      fill="#E59261"
                    />
                    <path
                      d="M18.2156 24.2024C18.8323 21.5015 21.1193 18.3929 22.7055 16.566C24.8203 14.1301 25.0518 11.6151 25.0005 9.84555C24.9491 8.07604 23.3163 4.59726 19.0791 3.66171C15.6894 2.91326 12.7535 4.53193 11.7014 5.62385C7.92457 9.12771 2.75589 18.2504 1.84537 24.6503C0.595642 33.4345 4.89166 41.9469 9.9426 47.4613C14.9935 52.9757 27.4842 58.0454 37.1961 54.414C46.908 50.7826 51.7089 44.2937 52.6355 43.1965C53.5621 42.0993 54.4447 39.4871 54.5188 37.7229C54.593 35.9587 52.8929 31.0884 47.8971 30.2472C43.9004 29.5742 41.8194 31.6345 40.7493 32.724C39.3228 34.1763 36.6161 37.5257 32.8487 38.5793C28.1395 39.8962 24.6217 39.3679 20.7575 35.5445C16.8933 31.7211 17.4448 27.5784 18.2156 24.2024Z"
                      fill="#F3D146"
                    />
                    <path
                      d="M24.3102 7.91604C29.1501 4.7866 34.0944 7.65133 35.8827 8.98826C38.1718 10.6997 40.1344 15.345 38.5356 19.4885C36.9005 23.7263 32.6493 27.9641 26.2724 29.431C19.8955 30.8979 17.1158 25.6822 16.7888 22.0964C16.4618 18.5105 18.2604 11.8279 24.3102 7.91604Z"
                      fill="#C5B5D3"
                    />
                    <path
                      d="M70.1629 7.56896C61.9472 0.947906 51.7301 0.154302 47.5131 0.959592C44.8837 1.46171 42.1412 3.26423 41.2205 6.44668C40.0696 10.4247 41.5612 12.6114 42.9177 13.5824C44.0029 14.3593 46.5588 14.6016 48.2054 14.7154C49.6222 14.8133 51.154 15.4674 52.1399 16.4129C53.1259 17.3583 53.4999 18.9194 53.7699 21.3507C53.9118 25.6374 57.0273 28.0946 59.7102 28.8892C61.9637 29.5567 63.2917 29.356 65.832 30.6282C68.3724 31.9003 69.3642 33.3945 70.2697 34.5537C71.1752 35.7129 73.7851 35.9775 75.58 35.3592C77.9133 34.5554 78.7503 31.74 78.8771 30.4328C79.3956 25.5703 78.3786 14.19 70.1629 7.56896Z"
                      fill="#AFCBA2"
                    />
                    <path
                      d="M3.33151 52.898C5.43905 51.4168 7.54269 51.4617 9.08821 51.9489C10.6337 52.4362 12.5852 53.8979 13.756 55.7493C15.0087 57.7301 15.6255 60.109 18.1623 62.6426C20.6992 65.1763 22.7326 64.9093 24.684 66.4685C26.6354 68.0276 26.1632 70.3409 25.6753 71.6077C25.1875 72.8745 22.9433 74.8235 18.8453 74.8235C14.7474 74.8235 8.86185 72.6737 5.75518 69.4893C2.04747 65.6889 0.599511 61.4733 0.50194 59.4269C0.404368 57.3805 0.697082 54.7495 3.33151 52.898Z"
                      fill="#95ABCC"
                    />
                  </svg>

                  {userDetails?.requestId ? (
                    <div className="pt-6">
                      <h2 className="text-black text-center font-montserrat font-bold leading-6 text-[15px] leading-24">
                        {userDetails?.firstName} sent you a friend Request
                      </h2>
                      <div className="flex justify-center items-center py-3">
                        <Image
                          src={
                            userDetails?.image
                              ? userDetails?.image
                              : "/assets/images/noProfile.png"
                          }
                          width={89}
                          height={89}
                          className="!w-[89px] rounded-[13.198px] !h-[89px] cursor-pointer"
                          alt={".."}
                          unoptimized
                        />
                      </div>
                      <h2 className="text-black text-center font-montserrat font-bold leading-6 text-[15px] leading-24">
                        {userDetails?.firstName}
                      </h2>
                      <p className="text-black text-center font-montserrat font-semibold leading-normal text-[10px] pt-1">
                        {userDetails?.email}
                      </p>
                    </div>
                  ) : (
                    <div className="pt-6">
                      <h2 className="text-black text-center font-montserrat font-bold leading-6 text-[15px] leading-24 capitalize">
                        Friend Request Already {userDetails.errorStatus}
                      </h2>
                    </div>
                  )}
                  {userDetails?.requestId ? (
                    <div className="flex justify-center gap-4 mt-7">
                      <button
                        onClick={() =>
                          handleFriendRequest("reject", userDetails?.requestId)
                        }
                        className="bg-black text-white text-[10px] font-bold px-8 py-2 rounded-[40px] border solid  border-black "
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          handleFriendRequest("accept", userDetails?.requestId)
                        }
                        className="bg-orange-darker text-white text-[10px] font-bold px-8 py-2 rounded-[40px] border solid  border-black "
                      >
                        Accept
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-4 mt-7">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-black text-white text-[10px] font-bold px-8 py-2 rounded-[40px] border solid  border-black "
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Modal>
          </div>
        )}

        {openModal && (
          <div className="h-full w-full fixed top-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className="w-full lg:max-w-2xl md:max-w-xl lg:h-[90vh] md:h-[80vh]  sm:max-w-lg  max-w-sm sm:h-[70vh] h-[65vh] bg-white rounded-xl overflow-hidden flex flex-col"
              ref={modalRef}
            >
              <div className="flex-none bg-purple py-6 px-6 sticky top-0 flex items-center justify-center">
                <h3 className="text-center text-lg font-medium text-black flex gap-x-2 m-auto items-center justify-center">
                  Threads
                </h3>
              </div>
              <div className="flex-1 no-scrollbar overflow-y-auto p-4 pt-0 mt-0">
                {commentMessages?.map((message, index) =>
                  index == 0 ? (
                    <div
                      key={index}
                      className="sticky top-0 py-3 z-50 bg-white flex justify-between items-center  mb-4"
                    >
                      <div className="flex mb-2 w-full bg-white relative z-[999]">
                        <Image
                          className="w-10 h-10 rounded-[10px] mr-2"
                          width={40}
                          height={40}
                          src={
                            message?.userId?.image
                              ? message?.userId?.image!
                              : "/assets/images/noProfile.png"
                          }
                          unoptimized
                          alt="likeIcon"
                        />
                        <div className="flex-1 ps-3">
                          <span className="font-montserrat text-xl font-bold leading-normal">
                            {message?.userId?.nickName}
                          </span>
                          <span className="font-montserrat text-[8px] font-normal leading-normal ps-4">
                            {setCreatedAtIfNotPresent(message)}
                          </span>
                          <div>
                            <p className="font-montserrat text-black text-[15px] font-medium leading-normal">
                              {message?.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className=" py-3 bg-white flex justify-between items-center border-t  border-black"
                    >
                      <div className="flex mb-2 w-full relative">
                        <div
                          style={{
                            backgroundColor: colors[index % colors.length],
                            alignItems: "center",
                            borderRadius: 50,
                            paddingInline: 20,
                            justifyContent: "center",
                            position: "absolute",
                            right: 0,
                            top: -25,
                          }}
                        >
                          <div className="flex justify-center items-center">
                            {moment(message?.createdAt).format("MMM Do")}
                          </div>
                        </div>
                        <Image
                          className="w-10 h-10 rounded-[10px] mr-2"
                          width={40}
                          height={40}
                          src={message?.user?.image}
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
                  )
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="flex gap-x-4 py-4 px-6 border-t-2 border-black bg-white">
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
                <form onSubmit={sendComment} className="flex gap-2 w-[80%]">
                  <input
                    accept="image/*"
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
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
    </>
  );
};

export default Notifications;
