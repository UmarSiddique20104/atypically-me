"use client";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useRef, useState } from "react";
import profile from "../../../../public/assets/images/profile.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { saveUserProfileData } from "@/app/redux/users/profileSlice";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
  reportAccount,
} from "../utils/Helper";
import NoImg from "../../../../public/assets/images/noimgpic.jpeg"
import API_ENDPOINTS from "../ApiRoutes/apiRoutes";
import getAndDecryptCookie, { clearAllCookies } from "@/app/lib/auth";
import {
  addChatData,
  disconnectSocket,
  initializeSocket,
} from "@/app/redux/users/userChat";
import { showMessage } from "../reuseables/Notification";
import axios from "axios";
import { addChannelName } from "@/app/redux/users/profileSlice";
import { User } from "@/app/(pages)/(users)/(Dashboard)/community/Community";
import { getUserChannels } from "@/app/(pages)/components/reuseable/ApiCall";
import { Tooltip } from 'react-tooltip';

interface ProfileData {
  image?: string | StaticImageData | null;
  nickName?: string;
  Id: string;
}
const defaultProfileImage: string = NoImg as unknown as string;

const Sidebar = () => {
  const [clicked, setClicked] = useState(false);
  const [clickhome, setClickhome] = useState(false);
  const [clickprofile, setClickprofile] = useState(false);
  const [clicknotify, setClicknotify] = useState(false);
  const [model, setModel] = useState(false);
  const [model2, setModel2] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const [selectedAge, setSelectedAge] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [selection, setSelection] = useState("No longer needed");
  const [contactSelection, setContactSelection] = useState(
    "Block contact and delete chat"
  );
  const [channels, setChannels] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [image, setImage] = useState<string>("");
  const token = getAndDecryptCookie("AccessToken");
  const navigate = useRouter();
  const handleLogout = () => {
    clearAllCookies();
    navigate.push("/welcome");
  };
  const modelRef = useRef<HTMLDivElement>(null);
  const pathUrlRef = useRef<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [matchingIds, setMatchingIds] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0); // Example count for testing



  const pathname = usePathname();

  useEffect(() => {
    const updatePath = () => {
      if (typeof window !== "undefined") {
        const currentUrl = window.location.href;
        const urlParts = currentUrl.split("?")[0]; // Split by "?" and take the first part
        pathUrlRef.current = urlParts.split("/").pop(); // Get the last part of the path
      }
    };

    updatePath();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        modelRef.current &&
        !modelRef.current.contains(event.target as Node)
      ) {
        setModel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeTab === "home" || (!clickprofile && !clicknotify && !clicked)) {
      setClickhome(true);
    } else {
      setClickhome(false);
    }
  }, [activeTab, clickprofile, clicknotify, clicked]);

  const handlehome = () => {
    setActiveTab("home");
    setClickhome(true);
    if (clickhome === false) {
      setClickprofile(false);
      setClicknotify(false);
      setClicked(false);
    }
  };
  const handleClick = () => {
    setActiveTab("clicked");
    setClicked(true);
    if (clicked === false) {
      setClickprofile(false);
      setClicknotify(false);
      setClickhome(false);
    }
  };

  const handleProfielClick = () => {
    setActiveTab("profile");
    setClickprofile(true);
    if (clickprofile === false) {
      setClicked(false);
      setClicknotify(false);
      setClickhome(false);
    }
  };

  const handleNotify = () => {
    setActiveTab("notify");
    setClicknotify(true);
    if (clicknotify === false) {
      setClicked(false);
      setClickprofile(false);
      setClickhome(false);
    }
  };

  const handleopenmodel = () => {
    setModel(!model);
  };

  const handlechange = () => {
    // navigate.push("/business/edit-profile");
    setModel(false);
  };

  const handleOpenModal = () => {
    setModel(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal2 = () => {
    setModel2(false);
    setIsModalOpen2(true);
  };

  const handleCloseModal2 = () => {
    setIsModalOpen2(false);
  };

  const handleAgeChange = (event: any) => {
    setSelection(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };
  const dispatch = useDispatch();

  const data = useSelector(
    (state: RootState) => state?.userProfile
  ) as ProfileData;
  const socket = useSelector((state: RootState) => state.sockets.socket);
  const userProfilesData = useSelector((state: RootState) => state.user);


  useEffect(() => {
    if (typeof data.image === "string") {
      setImage(data.image);
    } else if (data.image && typeof data.image !== "string") {
      setImage((data.image as unknown as { src: string }).src);
    } else {
      setImage(defaultProfileImage);
    }
  }, [data.image]);

  const getProfileData = async () => {
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GET_USER_PROFILE}`;

    try {
      const result = await fetchApi(url, requestOptions);
      const { attributes } = result?.data[0];
      dispatch(saveUserProfileData(attributes));
      console.log('workingProfile', attributes)
    } catch (error) {
      console.error("GetDeals error:", error);
    }
  };


  useEffect(() => {
    const initializeAndFetchProfile = async () => {
      try {
        //@ts-ignore
        const result = await dispatch(initializeSocket()).unwrap();

      } catch (error) {
        console.error('Error initializing socket or fetching profile data:', error instanceof Error ? error.message : error);
      }
    };

    initializeAndFetchProfile();

    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);

  
  useEffect(() => {
    if (socket?.connected) {
      console.log('socket', socket)
      getProfileData();
      socket?.on("notificationCount", (data) => {
        console.log('notificationCountHOME')
        setNotificationCount(data?.count)

      });
    }

  }, [socket])



  useEffect(() => {
    const checkSocketConnection = () => {
      if (socket?.connected) {
        socket?.emit("addClient", {
          userId: getAndDecryptCookie("Id"),
          nickName: data?.nickName,
          image: data?.image,
        });
        clearInterval(intervalId); // Stop the interval once the socket is connected
      }
    };


    const intervalId = setInterval(checkSocketConnection, 1000); // Check every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [data]);




  const handleReport = () => {
    setIsLoading(true);
    const userId = userProfilesData?.userProfile?.Id;
    const url = API_ENDPOINTS.REPORT_ACCOUNT;
    axios
      .post(
        url,
        {
          data: { attributes: { userId, reason: selection } },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          setIsModalOpen(false);
          showMessage("User Reported Successfully", "success");
        } else {
          throw new Error("Failed to report account");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          const errorMessage = error.response.data.error[0].title;
          console.error("Report Account Error:", errorMessage);
          showMessage(errorMessage, "error");
        } else {
          const errorMessage = error.message || "Failed to report account";
          console.error("Error:", errorMessage);
          showMessage(errorMessage, "error");
        }
      });
  };


  const handleBlock = () => {
    setIsLoading(true);
    const userId = userProfilesData?.userProfile?.Id;
    const url = API_ENDPOINTS.BLOCK_ACCOUNT;

    axios
      .post(
        url,
        {
          data: { attributes: { blockedId: userId, selection } },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          setIsModalOpen(false);
          showMessage("User Blocked Successfully", "success");
        } else {
          showMessage("User Blocked Successfully", "success");
        }
      })
      .catch((error) => {
        console.log("error--->", error);
        setIsLoading(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          const errorMessage = error.response.data.error[0].title;
          console.error("Report Account Error:", errorMessage);
          showMessage(errorMessage, "error");
        } else {
          const errorMessage = error.message || "Failed to report account";
          console.error("Error:", errorMessage);
          showMessage(errorMessage, "error");
        }
      });
  };

  const { push } = useRouter();
  const user = useSelector((state: RootState) => state.user.userProfile);
  const convertUserProfile = async (user: any) => {
    const allChannels = await getUserChannels(API_ENDPOINTS.GET_CHANNELS);
    setChannels(allChannels?.data);

    const allDirectUsers = await getUserChannels(
      API_ENDPOINTS.GET_CONVERSATIONS
    );
    setAllUsers(allDirectUsers?.data?.attributes?.rows);

    // Compare user IDs and save matching ID in state
    const matchingDirectUser = allDirectUsers?.data?.attributes?.rows.find(
      (directUser: any) => directUser?.participants?.userId?._id === user.Id
    );
    const matchingId = matchingDirectUser ? matchingDirectUser._id : null;
    return {
      messagesCount: 0,
      isUser: true,
      _id: matchingId || null, // Set to null if no match is found
      participants: {
        userId: {
          image: user.image,
          nickName: user.nickName,
          status: "online",
          _id: user?.Id || null, // Set to null if no match is found
        },
      },
    };
  };

  const selectUser = async (user: any) => {
    const convertedData = await convertUserProfile(user);
    if (convertedData) {
      dispatch(
        addChannelName({
          channelName: convertedData?.participants?.userId?.nickName!,
        })
      );
      //@ts-ignore
      dispatch(addChatData(convertedData));
      push("/chats"); // Use dispatch to navigate
    }
  };

  return (
    <div
      className="w-24 bg-black max-sm:py-6 py-6 pb-4 h-full max-sm:h-24 flex flex-col max-sm:flex-row max-sm:w-svw  max-sm:items-center justify-between max-sm:px-4"
      style={{ overflow: "hidden" }}
    >
      <Link href={'/profile'}>
        <div className="flex justify-center">
          {!image ? (
            <Image
              src={NoImg}
              alt="profilePic"
              width={50}
              height={50}
              className="!h-[70px] !w-[70px] rounded-[10px] object-cover"
              unoptimized
            />
          ) : (
            <Image
              src={image}
              alt="profilePic"
              width={50}
              height={50}
              className="!h-[70px] !w-[70px] rounded-[10px] object-cover"
              unoptimized
            />
          )}
        </div>
      </Link>
      <div className="flex items-center justify-center">
        <div className="flex flex-col gap-14 max-sm:flex-row">
          <div className="flex flex-col max-sm:flex-row gap-14 max-sm:gap-6 items-center">
            <Link href={"/home"}>
              <svg
                onClick={() => handlehome()}
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer focus:outline-none"
                width="35"
                height="33"
                viewBox="0 0 35 33"
                fill="none"
                data-tooltip-id="home-tooltip"

              >
                <g clipPath="url(#clip0_10_2205)">
                  <path
                    d="M19.309 17.4803C19.2587 18.7007 18.1757 21.8494 16.5218 20.0066C15.422 18.778 15.6109 16.9027 15.9593 15.4382C16.3917 13.6238 17.1472 11.8461 18.0875 10.2229H16.908C18.1841 12.3993 19.2419 14.9541 19.3048 17.4763C19.3258 18.3265 20.6901 18.3306 20.6691 17.4763C20.5977 14.7181 19.4811 11.9356 18.0833 9.55577C17.8315 9.12863 17.1556 9.12456 16.9038 9.55577C15.3213 12.2895 13.5583 16.1704 14.6119 19.3272C15.0652 20.6859 16.2951 22.1789 17.949 21.8453C19.9135 21.4507 20.5977 19.1442 20.6649 17.4803C20.6985 16.6301 19.3342 16.6301 19.3006 17.4803H19.309Z"
                    fill={clickhome ? "#EAA881" : "#f5f5f5"}
                  />
                  <path
                    d="M32.7587 2.47356C30.3325 0.134429 26.7309 -0.642568 23.5281 0.573778C19.5613 2.08302 18.0586 6.07378 16.8455 9.71468H18.1593C17.1099 6.56601 15.8758 3.02274 12.8073 1.20839C10.4189 -0.207287 7.37976 -0.386281 4.83178 0.71616C-1.51926 3.45802 -0.465651 11.5168 1.5786 16.6751C2.91765 20.0557 5.03327 23.2287 7.31259 26.0764C9.37784 28.6555 11.9174 31.4096 15.1496 32.5893C17.941 33.6063 20.594 32.5812 22.8565 30.9092C25.9208 28.6433 28.3176 25.5231 30.3451 22.3826C32.4607 19.1159 34.1524 15.6866 34.7568 11.8423C35.2647 8.62038 35.1388 4.99981 32.7587 2.46542C32.1669 1.83487 31.2014 2.77052 31.7933 3.40107C35.525 7.36335 33.2331 14.6085 30.9538 18.7335C29.2327 21.8497 27.1969 24.8641 24.7077 27.4595C22.9404 29.3064 20.5352 31.5398 17.7815 31.7106C14.9523 31.8815 12.3917 29.5952 10.5826 27.7646C8.17311 25.3238 6.19602 22.4802 4.49597 19.539C3.07716 17.0819 2.04035 14.4662 1.5828 11.6755C1.17143 9.16956 1.11267 6.15107 2.70357 3.98687C4.46659 1.60299 7.85409 0.773113 10.6581 1.68436C14.3982 2.9007 15.7415 6.75314 16.8455 10.0686C17.0553 10.6951 17.9536 10.6951 18.1593 10.0686C19.2045 6.92807 20.4344 3.2831 23.8219 1.87962C26.5672 0.744636 29.6903 1.38332 31.7933 3.40921C32.4187 4.01128 33.38 3.07563 32.7587 2.47356Z"
                    fill={clickhome ? "#EAA881" : "#f5f5f5"}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_10_2205">
                    <rect width="35" height="33" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <Tooltip id="home-tooltip" place="right">
              Home
            </Tooltip>

            <Link href={"/profile"}>
              <svg
                onClick={() => handleProfielClick()}
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer focus:outline-none"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                data-tooltip-id="profile-tooltip"
              >
                <g clipPath="url(#clip0_10_2208)">
                  <path
                    d="M11.1449 27.5869C13.5965 26.2268 15.8337 24.4601 17.9747 22.6602C20.6408 20.4131 23.1811 17.9848 25.4368 15.3274C27.1821 13.2725 29.0162 10.9478 29.7817 8.31624C30.6469 5.34839 28.8461 2.44707 26.3427 0.89108C23.9059 -0.620563 21.4728 -0.0181232 19.121 1.29024C16.3551 2.82776 13.9108 4.98988 11.6589 7.19267C7.50999 11.2434 3.06527 16.0186 1.17201 21.6106C0.598857 23.2996 0.0996581 25.0958 0.0109116 26.8847C-0.0445549 27.9713 0.0774715 29.1873 1.1831 29.6899C2.52539 30.2997 4.3447 29.8784 5.70548 29.5716C7.58394 29.1466 9.44392 28.4961 11.1449 27.5869C11.829 27.221 11.2225 26.1861 10.5385 26.5483C9.15919 27.2838 7.67269 27.8161 6.164 28.2189C4.91046 28.5552 3.31302 29.0135 2.0114 28.6957C0.00351624 28.2041 1.91896 23.1592 2.33311 21.9321C3.98971 17.0424 7.76144 12.9029 11.2965 9.2587C13.3599 7.12984 15.5637 5.07859 18.0117 3.39693C19.72 2.22532 22.0089 0.724762 24.1869 1.24589C27.0638 1.93334 29.4858 5.16359 28.5984 8.08709C27.8736 10.471 26.1763 12.6035 24.59 14.4737C22.4305 17.0202 20.0084 19.3486 17.4718 21.5145C15.3086 23.3587 13.0345 25.1624 10.5422 26.5446C9.86547 26.9216 10.4719 27.9565 11.1486 27.5832L11.1449 27.5869Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                  <path
                    d="M0.736083 25.0917L4.82951 29.1757C5.37678 29.7227 6.22727 28.8726 5.68 28.3256L1.58657 24.2416C1.0393 23.6946 0.188813 24.5447 0.736083 25.0917Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                  <path
                    d="M2.99917 20.2575C3.50207 19.4185 4.55593 18.1693 5.68005 18.7791C7.01495 19.5035 5.73182 20.701 5.24002 21.4772C4.86655 22.0685 5.69854 22.6636 6.18295 22.2053C6.38263 22.0205 6.58601 21.8394 6.81897 21.6989C7.48826 21.2924 7.53264 21.2702 8.14647 21.9022C8.7492 22.5157 8.77139 22.3938 8.39791 22.9482C8.17975 23.2734 7.9283 23.5617 7.65836 23.8389C7.19984 24.3083 7.80997 25.1916 8.38682 24.7813C9.06351 24.3009 10.4872 23.5543 11.2119 24.3304C11.9626 25.1362 11.0418 26.1378 10.4095 26.6404C9.80307 27.1209 10.6609 27.9672 11.26 27.4905C12.373 26.6071 13.2161 25.077 12.2806 23.765C11.1971 22.2422 9.0783 22.8299 7.78409 23.7465C8.02814 24.0606 8.26849 24.3748 8.51255 24.6889C9.51834 23.6578 10.7645 21.9539 9.39261 20.6973C8.12428 19.5331 6.40852 20.3499 5.33616 21.3589C5.65047 21.6028 5.96478 21.8431 6.27909 22.087C6.77459 21.3035 7.48826 20.7491 7.48826 19.7512C7.48826 18.9159 7.01125 18.1545 6.28649 17.748C4.53744 16.7722 2.83647 18.2099 1.9638 19.6588C1.56444 20.324 2.60351 20.9265 3.00287 20.2649L2.99917 20.2575Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                  <path
                    d="M19.7983 6.51959C14.7583 11.1839 9.80698 15.9849 5.41403 21.2738C4.92222 21.8652 5.76901 22.7189 6.26452 22.1239C10.6575 16.835 15.6088 12.0339 20.6488 7.36966C21.2183 6.84484 20.3678 5.99477 19.7983 6.51959Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                  <path
                    d="M23.0588 9.97159C18.2554 14.9242 13.1118 19.5737 7.67235 23.824C7.06222 24.3008 7.9201 25.1435 8.52284 24.6741C13.9623 20.4237 19.1022 15.7742 23.9093 10.8217C24.4491 10.2673 23.5986 9.4172 23.0588 9.97159Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                  <path
                    d="M26.8238 12.6844C23.6363 9.50224 20.4489 6.32372 17.2614 3.14151C16.7141 2.59451 15.8636 3.44458 16.4109 3.99158C19.5984 7.17379 22.7858 10.356 25.9733 13.5345C26.5206 14.0815 27.3711 13.2314 26.8238 12.6844Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_10_2208">
                    <rect width="30" height="30" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <Tooltip id="profile-tooltip" place="right">
              Profile
            </Tooltip>

            <div>
              <Link href={"/community"}>
                <svg
                  onClick={() => handleClick()}
                  className={`shrink-0 cursor-pointer focus:outline-none ${clicked ? "text-orange-dark" : "text-white"
                    }`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="31"
                  viewBox="0 0 33 31"
                  fill="none"
                  data-tooltip-id="community-tooltip"
                >
                  <g clipPath="url(#clip0_10_2215)">
                    <path
                      d="M3.9998 4.44161C2.2259 6.00259 1.41439 8.74258 0.884571 11.0675C0.156901 14.2483 -0.111365 17.6016 0.0395346 20.8742C0.166961 23.5737 0.515706 26.6076 1.88721 28.9252C2.92674 30.6845 4.72077 31.9259 6.25323 30.1005C7.84606 28.1979 8.79169 25.469 9.57637 23.0669C9.3517 23.2065 9.13038 23.346 8.90571 23.4819C12.135 24.2385 15.4313 24.7674 18.7209 25.0907C21.142 25.3294 23.6134 25.469 26.0345 25.1641C27.7279 24.9511 29.6963 24.5544 30.8666 23.0595C32.3454 21.168 32.7344 18.3178 32.9121 15.9231C33.1234 13.0546 32.9758 9.95831 32.0939 7.222C30.4944 2.24522 25.1425 1.2315 20.8838 0.871554C17.7249 0.603432 14.5158 0.783404 11.3939 1.39311C8.88559 1.8816 6.17611 2.63822 4.10711 4.34979C3.55381 4.80523 4.09705 5.84466 4.65705 5.38188C6.33036 3.99719 8.42283 3.30669 10.4449 2.81819C12.9867 2.20114 15.6023 1.94404 18.2011 1.95506C20.7396 1.96241 23.3149 2.21216 25.7628 2.97613C27.5434 3.53073 29.5554 4.40121 30.5145 6.25235C31.6747 8.48915 31.8927 11.3687 31.8927 13.8883C31.8927 16.4079 31.6747 19.3683 30.4642 21.6161C29.5588 23.302 27.7916 23.7354 26.1317 23.9631C23.9554 24.2606 21.7288 24.1614 19.5491 23.9814C16.0785 23.6913 12.5977 23.1367 9.19074 22.3397C8.88559 22.2699 8.62403 22.4388 8.52008 22.7584C7.91983 24.5985 7.19216 26.4423 6.24653 28.1024C5.86425 28.7746 5.20029 30.1152 4.33849 29.8324C3.5974 29.59 3.02063 28.7268 2.65512 28.0326C1.51835 25.884 1.22326 23.1918 1.1193 20.7566C0.99523 17.8624 1.20314 14.9314 1.77655 12.1033C2.25272 9.74528 2.96363 6.87675 4.76436 5.29373C5.31095 4.81258 4.53633 3.97148 3.9931 4.44896L3.9998 4.44161Z"
                      fill={clicked ? "#EAA881" : "white"}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_2215">
                      <rect
                        width="33"
                        height="30.25"
                        fill="white"
                        transform="translate(0 0.75)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Tooltip id="community-tooltip" place="right">
                Community
              </Tooltip>
            </div>

            <Link href={"/notifications"}>
              <div className="relative cursor-pointer">
                <svg
                  onClick={() => handleNotify()}
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer focus:outline-none"
                  width="26"
                  height="28"
                  viewBox="0 0 26 28"
                  fill="none"
                  data-tooltip-id="notification-tooltip"
                >
                  <path
                    d="M12.2519 27.25C14.6519 27.25 14.5019 25 14.5019 23.5H10.0019C10.0019 24.75 9.85185 27.25 12.2519 27.25Z"
                    stroke={clicknotify ? "#EAA881" : "#F5F5F5"}
                    strokeWidth="1.12941"
                  />
                  <path
                    d="M22.7609 15.7649C23.1341 17.0488 25 18.0518 25 19.6166C25 24.1102 19.5266 23.4683 17.5363 23.4683H6.34065C3.35516 23.4683 0.36961 21.5424 1.116 18.9746C1.52079 17.5821 3.35513 16.4068 3.35513 14.481C3.35513 10.6293 2.90732 1 13.058 1C23.6938 1 22.0145 13.1971 22.7609 15.7649Z"
                    stroke={clicknotify ? "#EAA881" : "#F5F5F5"}
                    strokeWidth="1.12941"
                  />
                </svg>
                {notificationCount > 0 && (
                  <div className="absolute -top-3 left-3 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </div>
                )}
              </div>

            </Link>
            <Tooltip id="notification-tooltip" place="right">
              Notifications
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="flex justify-center" ref={modelRef}>
        <svg
          className="relative cursor-pointer"
          onClick={() => handleopenmodel()}
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="19"
          viewBox="0 0 23 19"
          fill="none"
        >
          <rect x="0.400391" width="22.2" height="3.7" rx="1.85" fill="white" />
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

        {model ? (
          pathUrlRef.current == "user-profile" ? (
            <div

              className="absolute py-8 px-3 text-center  max-sm:px-1 z-[9999999] 
                        top-[83%] left-[80%] max-sm:top-[74%] max-md:top-[73%] max-lg:top-[73%] 
                        max-xl:top-[73%] max-2xl:top-[76%] max-sm:left-[50%] rounded-[10px]
                      bg-white cursor-pointer"
            >
              <div onClick={() => selectUser({ isUser: true, ...user })}>
                <div className="flex items-center gap-5">
                  <div className="ps-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="7"
                      height="9"
                      viewBox="0 0 7 9"
                      fill="none"
                    >
                      <path
                        d="M0.238868 4.02454L4.84681 0.198343C5.1653 -0.0661145 5.6803 -0.0661145 5.9954 0.198343L6.76113 0.834167C7.07962 1.09862 7.07962 1.52626 6.76113 1.7879L3.49492 4.5L6.76113 7.2121C7.07962 7.47655 7.07962 7.90419 6.76113 8.16583L5.9954 8.80166C5.67691 9.06611 5.16191 9.06611 4.84681 8.80166L0.238868 4.97546C-0.079622 4.71663 -0.079622 4.289 0.238868 4.02454Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <p onClick={() => handleopenmodel()} className="font-montserrat cursor-pointer font-medium leading-normal capitalize text-[15px]">
                    Send a text
                  </p>
                </div>
              </div>
              <div onClick={handleOpenModal}>
                <p className="font-montserrat pe-20  px-10  cursor-pointer pt-1 font-medium leading-normal capitalize text-[15px]">
                  Report
                </p>
              </div>

              <div onClick={handleOpenModal2}>
                <p className="font-montserrat pe-20  px-10  cursor-pointer pt-1 font-medium leading-normal capitalize text-[15px]">
                  Block
                </p>
              </div>
            </div>
          ) : (
            <div

              className="absolute py-8 flex flex-col gap-3 px-10 pe-20 max-sm:px-4 z-50 rounded-[30px] w-[238px]
              top-[65%] left-[80%] 
              max-sm:top-[74%] max-md:top-[51%] max-lg:top-[51%] max-xl:top-[52%] max-2xl:top-[57%] max-sm:left-[50%] 
             max-[500px]:left-[40%] max-[400px]:left-[30%] bg-white"
              onClick={() => handlechange()}
            >
              <Link href={"/about"}>
                <p className="font-montserrat cursor-pointer font-medium leading-normal capitalize text-xs">
                  About
                </p>
              </Link>
              <Link href={"/settings"}>
                <p className="font-montserrat cursor-pointer pt-1 font-medium leading-normal capitalize text-xs">
                  Settings
                </p>
              </Link>

              <Link href={"/terms-&-conditions"}>
                <p className="font-montserrat cursor-pointer pt-1 font-medium leading-normal capitalize text-xs">
                  Terms & Conditions
                </p>
              </Link>
              <Link href={"/privacy-&-policy"}>
                <p className="font-montserrat cursor-pointer pt-1 font-medium leading-normal text-xs">
                  Privacy & Policy
                </p>
              </Link>
              <Link href={"/faqs"}>
                <p className="font-montserrat cursor-pointer pt-1 font-medium leading-normal text-xs">
                  Faqs
                </p>
              </Link>

              <div onClick={() => handleLogout()}>
                <p className="font-montserrat cursor-pointer pt-1 font-extrabold leading-normal text-xs">
                  Logout
                </p>
              </div>
            </div>
          )
        ) : (
          ""
        )}
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="ModelView">
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Delete Account Modal"
            className="modal flex justify-center items-center min-h-screen"
          >
            <div className="flex justify-center items-center">
              <div className="modal-content bg-primary w-[617px] h-[517px] rounded-[20px] flex flex-col items-center pt-11">
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
                <div className="text-black text-center font-montserrat font-semibold leading-5 text-xl py-[23px]">
                  Report {userProfilesData?.userProfile?.nickName}?
                </div>
                <div>
                  <h2 className="text-black text-center font-montserrat font-semibold leading-5 text-[11px]">
                    The last 5 messages from the contact will be forwarded to
                    <br />
                    Atypically me app. If you block this contact and delete the
                    chat,
                    <br />
                    messages will only be removed from this device and
                    <br />
                    this contact will not be notified.
                  </h2>
                  <p className="text-black text-center font-montserrat font-normal text-[10px] leading-6 pt-[14px]">
                    Reason for reporting :
                  </p>
                </div>
                <div className="pt-2">
                  <form
                    className="flex justify-center gap-4 "
                    onSubmit={handleSubmit}
                  >
                    <div>
                      <input
                        type="radio"
                        id="noneed"
                        name="noneed"
                        value="No longer needed"
                        checked={selection === "No longer needed"}
                        className="cursor-pointer"
                        onChange={handleAgeChange}
                      />
                      <label
                        htmlFor="age1"
                        className=" ps-2 font-montserrat text-black text-[10px] font-bold leading-none"
                      >
                        No longer needed
                      </label>
                      <br />
                      <input
                        type="radio"
                        id="Spam"
                        name="Spam"
                        value="Spam"
                        className="cursor-pointer"
                        checked={selection === "Spam"}
                        onChange={handleAgeChange}
                      />
                      <label
                        htmlFor="age2"
                        className=" ps-2 font-montserrat text-black text-[10px] font-bold leading-none"
                      >
                        Spam
                      </label>
                      <br />
                      <input
                        type="radio"
                        id="messages"
                        name="messages"
                        className="cursor-pointer"
                        value="Offensive messages"
                        checked={selection === "Offensive messages"}
                        onChange={handleAgeChange}
                      />
                      <label
                        htmlFor="age3"
                        className=" ps-2 font-montserrat text-black text-[10px] font-bold leading-none"
                      >
                        Offensive messages
                      </label>
                      <br />

                      <input
                        type="radio"
                        id="Other"
                        name="Other"
                        value="Other"
                        className="cursor-pointer"
                        checked={selection === "Other"}
                        onChange={handleAgeChange}
                      />
                      <label
                        htmlFor="age3"
                        className=" ps-2 font-montserrat text-black text-[10px] font-bold leading-none"
                      >
                        Other
                      </label>
                      <br />
                      <br />
                    </div>
                  </form>

                  <input
                    type="radio"
                    id="block"
                    name="block"
                    value="Block contact and delete chat"
                    className="cursor-pointer"
                    checked={selection === "Block contact and delete chat"}
                    onChange={handleAgeChange}
                  />
                  <label
                    htmlFor="block"
                    className=" ps-2 font-montserrat text-black text-sm font-normal  leading-[10px]"
                  >
                    Block contact and delete chat
                  </label>
                </div>

                <div
                  onClick={() => handleCloseModal()}
                  className="flex justify-center gap-4 my-4"
                >
                  <button className="bg-black font-montserrat text-white text-[10px] font-bold px-8 py-2 rounded-[40px] border solid border-black ">
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReport()}
                    className="bg-orange-darker text-white text-[10px] font-bold px-8 py-2 rounded-[40px] border solid border-black "
                  >
                    Report
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {isModalOpen2 && (
        <div className="ModelView">
          <Modal
            isOpen={isModalOpen2}
            onRequestClose={handleCloseModal2}
            contentLabel="Delete Account Modal"
            className="modal flex justify-center items-center min-h-screen"
          >
            <div className="flex justify-center items-center">
              <div className="modal-content bg-primary w-[617px] h-[517px] rounded-[20px] flex flex-col items-center pt-11">
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
                <div className="text-black text-center font-montserrat font-semibold leading-5 text-xl py-[23px]">
                  Block user?
                </div>
                <div>
                  <h2 className="text-black text-center font-montserrat font-semibold leading-5 text-[11px]">
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    {userProfilesData?.userProfile?.nickName} won't be able to
                    message you anymore.
                  </h2>
                  <p className="text-black text-center font-montserrat font-normal text-[10px] leading-6 pt-[14px]">
                    Reason for blocking :
                  </p>
                </div>
                <div className="pt-2">
                  <form
                    className="flex justify-center gap-4 "
                    onSubmit={handleSubmit}
                  >
                    <div>
                      <input
                        type="radio"
                        id="noneed"
                        name="noneed"
                        value="No longer needed"
                        checked={selection === "No longer needed"}
                        className="cursor-pointer"
                        onChange={handleAgeChange}
                      />
                      <label
                        htmlFor="age1"
                        className=" ps-2 font-montserrat text-black text-[10px] font-bold leading-none"
                      >
                        No longer needed
                      </label>
                      <br />
                      <input
                        type="radio"
                        id="Spam"
                        name="Spam"
                        value="Spam"
                        className="cursor-pointer"
                        checked={selection === "Spam"}
                        onChange={handleAgeChange}
                      />
                      <label
                        htmlFor="age2"
                        className=" ps-2 font-montserrat text-black text-[10px] font-bold leading-none"
                      >
                        Spam
                      </label>
                      <br />
                      <input
                        type="radio"
                        id="messages"
                        name="messages"
                        className="cursor-pointer"
                        value="Offensive messages"
                        checked={selection === "Offensive messages"}
                        onChange={handleAgeChange}
                      />
                      <label
                        htmlFor="age3"
                        className=" ps-2 font-montserrat text-black text-[10px] font-bold leading-none"
                      >
                        Offensive messages
                      </label>
                      <br />

                      <input
                        type="radio"
                        id="Other"
                        name="Other"
                        value="Other"
                        className="cursor-pointer"
                        checked={selection === "Other"}
                        onChange={handleAgeChange}
                      />
                      <label
                        htmlFor="age3"
                        className=" ps-2 font-montserrat text-black text-[10px] font-bold leading-none"
                      >
                        Other
                      </label>
                      <br />
                      <br />
                    </div>
                  </form>
                </div>

                <div
                  onClick={() => handleCloseModal2()}
                  className="flex justify-center gap-4"
                >
                  <button className="bg-black font-montserrat text-white text-[10px] font-bold px-8 py-2 rounded-[40px] border solid border-black ">
                    Cancel
                  </button>
                  <button
                    onClick={() => handleBlock()}
                    className="bg-orange-darker text-white text-[10px] font-bold px-8 py-2 rounded-[40px] border solid border-black "
                  >
                    Block
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Sidebar;