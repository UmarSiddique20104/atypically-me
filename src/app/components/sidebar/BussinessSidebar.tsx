"use client";
import Image, { StaticImageData } from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import profileImage from "../../../../public/assets/images/profilePic.png";
import secureLocalStorage from "react-secure-storage";
import getAndDecryptCookie, { clearAllCookies } from "@/app/lib/auth";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import {
  saveDealsList,
  setError,
  setLoading,
} from "@/app/redux/templatesDataSlice";

import Noimg from "../../../../public/assets/images/noimgpic.jpeg"
import { createHeaders, createRequestOptions, fetchApi } from "../utils/Helper";
import { showMessage } from "../reuseables/Notification";
import API_ENDPOINTS from "../ApiRoutes/apiRoutes";
import { Deal } from "@/types/deals";
import { setEditMode } from "@/app/redux/editModeSlice";
import { Tooltip } from "react-tooltip";
interface ProfileData {
  image?: string | StaticImageData | null;
}
const defaultProfileImage: string = profileImage as unknown as string;

const BussinessSidebar = () => {
  const linkRef = React.useRef(null);
  const [clicked, setClicked] = useState(false);
  const [clicktemplate, setClicktemplate] = useState(false);
  const [clickprofile, setClickprofile] = useState(false);
  const [clickdashboard, setClickdashboard] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [model, setModel] = useState(false);
  const [image, setImage] = useState<string>("");
  const [dealsList, setDealsList] = useState<Deal>();
  const token = getAndDecryptCookie("AccessToken");
  const userId = getAndDecryptCookie("Id");
  const navigate = useRouter();

  const modelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        setModel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setClickdashboard(activeTab === "dashboard");
  }, [activeTab]);

  const handleClick = () => {
    setActiveTab("deals");
    setClicked(true);
    setClickdashboard(false);
    setClicktemplate(false);
    setClickprofile(false);
  };

  const handledashboardClick = () => {
    setActiveTab("dashboard");
    setClickdashboard(true);
    setClicked(false);
    setClicktemplate(false);
    setClickprofile(false);
  };

  const handleTempalteClick = () => {
    setActiveTab("template");
    setClicktemplate(true);
    setClickdashboard(false);
    setClicked(false);
    setClickprofile(false);
  };

  const handleProfielClick = () => {
    localStorage.setItem("edit", "false");
    setActiveTab("profile");
    setClickprofile(true);
    setClicktemplate(false);
    setClickdashboard(false);
    setClicked(false);
  };

  const handleopenmodel = () => {
    setModel(!model);
  };

  const handlechange = () => {
    setModel(!model);
    // if (model === true) {
    //   if (model === true) {
    //     setModel(false);
    //   } else {
    //     setModel(true);
    //   }
    // }
  };
  const handleLogout = () => {
    clearAllCookies();
    navigate.push("/welcome");
  };
  const profileReduxData = useSelector(
    (state: RootState) => state.profile
  ) as ProfileData;

  useEffect(() => {
    if (typeof profileReduxData.image === "string") {
      let imageUrl = profileReduxData.image;
      if (imageUrl.startsWith("http://")) {
        imageUrl = imageUrl.replace("http://", "https://");
      } else {
        imageUrl = profileReduxData.image;
      }
      setImage(imageUrl);
    }
  }, [profileReduxData.image]);
  const dispatch = useDispatch();

  const GetTemplatesData = useCallback(async () => {
    dispatch(setLoading(true));
    const headers = createHeaders(token ? token : "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.TemplatesDeals}/${userId}`;
    try {
      const result = await fetchApi(url, requestOptions);
      handleApiResponse(result);
    } catch (error) {
      console.error("GetDeals error:", error);
      dispatch(setError("Failed to fetch template data."));
    }
  }, []);

  const handleApiResponse = (result: any) => {
    if (result?.success && result?.status === 200) {
      dispatch(setLoading(false));
      dispatch(saveDealsList(result?.data)); // Dispatch saveDealsList action with the 'deals' data from API response
    } else {
      // showMessage(result?.message, "error");
      // console.error('API Response Error:', result);
      dispatch(setError(result?.message || "Unknown error occurred."));
    }
  };

  useEffect(() => {
    GetTemplatesData();
  }, []);
  const isEditing = useSelector((state: RootState) => state.editMode.isEditing);

  const handleClickEdit = () => {
    dispatch(setEditMode(!isEditing));
  };

  return (
    <div
      className="w-24 bg-black max-sm:py-6 py-6 pb-4 h-full max-sm:h-24 flex flex-col max-sm:flex-row max-sm:w-svw z-[99999999] max-sm:items-center justify-between max-sm:px-4"
      style={{ overflow: "hidden" }}
    >
      <div className="flex items-center justify-center">
        <Link href={"edit-profile"}>
          {!image ? (
            <Image
              src={Noimg}
              alt="profilePic"
              width={60}
              height={60}
              className="!h-[60px]  object-cover rounded-[10px] cursor-pointer"
              unoptimized
            />
          ) : (
            <Image
              src={image}
              alt="profilePic"
              width={60}
              height={60}
              className="!h-[60px]  object-cover rounded-[10px] cursor-pointer"
              unoptimized
            />
          )}
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex flex-col gap-14 max-sm:flex-row">
          <div className="flex flex-col max-sm:flex-row gap-14 max-sm:gap-6 items-center">
            <Link href={"/business/dashboard"}>
              <svg
                onClick={() => handledashboardClick()}
                className="max-sm:w-[30px] cursor-pointer focus:outline-none"
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="33"
                viewBox="0 0 35 33"
                fill="none"
                data-tooltip-id="home-tooltip"
              >
                <g clipPath="url(#clip0_242_5419)">
                  <path
                    d="M19.309 17.4804C19.2587 18.7008 18.1757 21.8495 16.5218 20.0066C15.422 18.7781 15.6109 16.9027 15.9593 15.4382C16.3917 13.6239 17.1472 11.8461 18.0875 10.223H16.908C18.1841 12.3994 19.2419 14.9541 19.3048 17.4763C19.3258 18.3265 20.6901 18.3306 20.6691 17.4763C20.5977 14.7182 19.4811 11.9356 18.0833 9.55583C17.8315 9.12869 17.1556 9.12462 16.9038 9.55583C15.3213 12.2896 13.5583 16.1705 14.6119 19.3273C15.0652 20.686 16.2951 22.179 17.949 21.8454C19.9135 21.4508 20.5977 19.1442 20.6649 17.4804C20.6985 16.6302 19.3342 16.6302 19.3006 17.4804H19.309Z"
                    fill={clickdashboard ? "#EAA881" : "#f5f5f5"}
                  />
                  <path
                    d="M32.7587 2.47356C30.3325 0.134429 26.7309 -0.642568 23.5281 0.573778C19.5613 2.08302 18.0586 6.07378 16.8455 9.71468H18.1593C17.1099 6.56601 15.8758 3.02274 12.8073 1.20839C10.4189 -0.207287 7.37976 -0.386281 4.83178 0.71616C-1.51926 3.45802 -0.465651 11.5168 1.5786 16.6751C2.91765 20.0557 5.03327 23.2287 7.31259 26.0764C9.37784 28.6555 11.9174 31.4096 15.1496 32.5893C17.941 33.6063 20.594 32.5812 22.8565 30.9092C25.9208 28.6433 28.3176 25.5231 30.3451 22.3826C32.4607 19.1159 34.1524 15.6866 34.7568 11.8423C35.2647 8.62038 35.1388 4.99981 32.7587 2.46542C32.1669 1.83487 31.2014 2.77052 31.7933 3.40107C35.525 7.36335 33.2331 14.6085 30.9538 18.7335C29.2327 21.8497 27.1969 24.8641 24.7077 27.4595C22.9404 29.3064 20.5352 31.5398 17.7815 31.7106C14.9523 31.8815 12.3917 29.5952 10.5826 27.7646C8.17311 25.3238 6.19602 22.4802 4.49597 19.539C3.07716 17.0819 2.04035 14.4662 1.5828 11.6755C1.17143 9.16956 1.11267 6.15107 2.70357 3.98687C4.46659 1.60299 7.85409 0.773113 10.6581 1.68436C14.3982 2.9007 15.7415 6.75314 16.8455 10.0686C17.0553 10.6951 17.9536 10.6951 18.1593 10.0686C19.2045 6.92807 20.4344 3.2831 23.8219 1.87962C26.5672 0.744636 29.6903 1.38332 31.7933 3.40921C32.4187 4.01128 33.38 3.07563 32.7587 2.47356Z"
                    fill={clickdashboard ? "#EAA881" : "#f5f5f5"}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_242_5419">
                    <rect
                      width="35"
                      height="33"
                      fill={clickdashboard ? "#EAA881" : "#f5f5f5"}
                    />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <Tooltip id="home-tooltip" place="right">
              Home
            </Tooltip>
            <Link href={"/business/select-template"}>
              <svg
                onClick={() => handleTempalteClick()}
                className={`max-sm:w-[30px] cursor-pointer focus:outline-none`}
                xmlns="http://www.w3.org/2000/svg"
                width="41"
                height="39"
                viewBox="0 0 41 39"
                fill="none"
                data-tooltip-id="template-tooltip"

              >
                <circle
                  cx="29.6897"
                  cy="26.8621"
                  r="10.7448"
                  stroke={clicktemplate ? "#EAA881" : "#f5f5f5"}
                  strokeWidth="1.13103"
                />
                <circle
                  cx="7.77586"
                  cy="17.6721"
                  r="7.21035"
                  stroke={clicktemplate ? "#EAA881" : "#f5f5f5"}
                  strokeWidth="1.13103"
                />
                <circle
                  cx="22.6205"
                  cy="5.65517"
                  r="5.08966"
                  stroke={clicktemplate ? "#EAA881" : "#f5f5f5"}
                  strokeWidth="1.13103"
                />
              </svg>
            </Link>
            <Tooltip id="template-tooltip" place="right">
              Select-Template
            </Tooltip>
            <div>
              <Link href={"/business/deals"}>
                <svg
                  onClick={() => handleClick()}
                  className={`shrink-0 focus:outline-none ${clicked ? "text-orange-dark" : "text-white"
                    } max-sm:w-[30px] cursor-pointer	`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="31"
                  viewBox="0 0 33 31"
                  fill="none"
                  data-tooltip-id="deals-tooltip"

                >
                  <g clipPath="url(#clip0_10_2215)">
                    <path
                      d="M3.9998 4.44161C2.2259 6.00259 1.41439 8.74258 0.884571 11.0675C0.156901 14.2483 -0.111365 17.6016 0.0395346 20.8742C0.166961 23.5737 0.515706 26.6076 1.88721 28.9252C2.92674 30.6845 4.72077 31.9259 6.25323 30.1005C7.84606 28.1979 8.79169 25.469 9.57637 23.0669C9.3517 23.2065 9.13038 23.346 8.90571 23.4819C12.135 24.2385 15.4313 24.7674 18.7209 25.0907C21.142 25.3294 23.6134 25.469 26.0345 25.1641C27.7279 24.9511 29.6963 24.5544 30.8666 23.0595C32.3454 21.168 32.7344 18.3178 32.9121 15.9231C33.1234 13.0546 32.9758 9.95831 32.0939 7.222C30.4944 2.24522 25.1425 1.2315 20.8838 0.871554C17.7249 0.603432 14.5158 0.783404 11.3939 1.39311C8.88559 1.8816 6.17611 2.63822 4.10711 4.34979C3.55381 4.80523 4.09705 5.84466 4.65705 5.38188C6.33036 3.99719 8.42283 3.30669 10.4449 2.81819C12.9867 2.20114 15.6023 1.94404 18.2011 1.95506C20.7396 1.96241 23.3149 2.21216 25.7628 2.97613C27.5434 3.53073 29.5554 4.40121 30.5145 6.25235C31.6747 8.48915 31.8927 11.3687 31.8927 13.8883C31.8927 16.4079 31.6747 19.3683 30.4642 21.6161C29.5588 23.302 27.7916 23.7354 26.1317 23.9631C23.9554 24.2606 21.7288 24.1614 19.5491 23.9814C16.0785 23.6913 12.5977 23.1367 9.19074 22.3397C8.88559 22.2699 8.62403 22.4388 8.52008 22.7584C7.91983 24.5985 7.19216 26.4423 6.24653 28.1024C5.86425 28.7746 5.20029 30.1152 4.33849 29.8324C3.5974 29.59 3.02063 28.7268 2.65512 28.0326C1.51835 25.884 1.22326 23.1918 1.1193 20.7566C0.99523 17.8624 1.20314 14.9314 1.77655 12.1033C2.25272 9.74528 2.96363 6.87675 4.76436 5.29373C5.31095 4.81258 4.53633 3.97148 3.9931 4.44896L3.9998 4.44161Z"
                      fill={clicked ? "#EAA881" : "#f5f5f5"}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_2215">
                      <rect
                        width="33"
                        height="30.25"
                        fill="#f5f5f5"
                        transform="translate(0 0.75)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Tooltip id="deals-tooltip" place="right">
                Deals
              </Tooltip>
            </div>
            <Link href={"/business/edit-profile"}>
              <svg
                onClick={() => handleProfielClick()}
                className="max-sm:w-[30px] cursor-pointer	focus:outline-none"
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                data-tooltip-id="profile-tooltip"
              >
                <g clipPath="url(#clip0_235_3983)">
                  <path
                    d="M11.1454 27.5869C13.597 26.2268 15.8342 24.4601 17.9752 22.6602C20.6413 20.4131 23.1816 17.9848 25.4373 15.3274C27.1826 13.2725 29.0167 10.9478 29.7821 8.31624C30.6474 5.34839 28.8466 2.44707 26.3432 0.89108C23.9064 -0.620563 21.4733 -0.0181232 19.1215 1.29024C16.3555 2.82776 13.9113 4.98988 11.6594 7.19267C7.51048 11.2434 3.06576 16.0186 1.1725 21.6106C0.599345 23.2996 0.100146 25.0958 0.0113999 26.8847C-0.0440666 27.9713 0.0779597 29.1873 1.18359 29.6899C2.52588 30.2997 4.34519 29.8784 5.70596 29.5716C7.58443 29.1466 9.44441 28.4961 11.1454 27.5869C11.8295 27.221 11.223 26.1861 10.5389 26.5483C9.15968 27.2838 7.67318 27.8161 6.16449 28.2189C4.91094 28.5552 3.31351 29.0135 2.01189 28.6957C0.00400452 28.2041 1.91945 23.1592 2.3336 21.9321C3.9902 17.0424 7.76192 12.9029 11.297 9.2587C13.3603 7.12984 15.5642 5.07859 18.0121 3.39693C19.7205 2.22532 22.0094 0.724762 24.1874 1.24589C27.0643 1.93334 29.4863 5.16359 28.5989 8.08709C27.8741 10.471 26.1768 12.6035 24.5905 14.4737C22.431 17.0202 20.0089 19.3486 17.4723 21.5145C15.3091 23.3587 13.0349 25.1624 10.5426 26.5446C9.86595 26.9216 10.4724 27.9565 11.1491 27.5832L11.1454 27.5869Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                  <path
                    d="M0.735594 25.0918L4.82903 29.1758C5.3763 29.7228 6.22678 28.8728 5.67951 28.3258L1.58608 24.2417C1.03881 23.6947 0.188324 24.5448 0.735594 25.0918Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                  <path
                    d="M2.99917 20.2575C3.50207 19.4185 4.55593 18.1693 5.68005 18.7791C7.01495 19.5035 5.73182 20.701 5.24002 21.4772C4.86655 22.0685 5.69854 22.6636 6.18295 22.2053C6.38263 22.0205 6.58601 21.8394 6.81897 21.6989C7.48826 21.2924 7.53264 21.2702 8.14647 21.9022C8.7492 22.5157 8.77139 22.3938 8.39791 22.9482C8.17975 23.2734 7.9283 23.5617 7.65836 23.8389C7.19984 24.3083 7.80997 25.1916 8.38682 24.7813C9.06351 24.3009 10.4872 23.5543 11.2119 24.3304C11.9626 25.1362 11.0418 26.1378 10.4095 26.6404C9.80307 27.1209 10.6609 27.9672 11.26 27.4905C12.373 26.6071 13.2161 25.077 12.2806 23.765C11.1971 22.2422 9.0783 22.8299 7.78409 23.7465C8.02814 24.0606 8.26849 24.3748 8.51255 24.6889C9.51834 23.6578 10.7645 21.9539 9.39261 20.6973C8.12428 19.5331 6.40852 20.3499 5.33616 21.3589C5.65047 21.6028 5.96478 21.8431 6.27909 22.087C6.77459 21.3035 7.48826 20.7491 7.48826 19.7512C7.48826 18.9159 7.01125 18.1545 6.28649 17.748C4.53744 16.7722 2.83647 18.2099 1.9638 19.6588C1.56444 20.324 2.60351 20.9265 3.00287 20.2649L2.99917 20.2575Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                  <path
                    d="M19.7979 6.51971C14.7578 11.184 9.80649 15.985 5.41354 21.2739C4.92174 21.8653 5.76853 22.719 6.26403 22.124C10.657 16.8351 15.6083 12.0341 20.6483 7.36978C21.2178 6.84496 20.3673 5.99489 19.7979 6.51971Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                  <path
                    d="M23.0593 9.97159C18.2559 14.9242 13.1123 19.5737 7.67284 23.824C7.06271 24.3008 7.92059 25.1435 8.52332 24.6741C13.9627 20.4237 19.1026 15.7742 23.9097 10.8217C24.4496 10.2673 23.5991 9.4172 23.0593 9.97159Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                  <path
                    d="M26.8238 12.6844C23.6363 9.50224 20.4489 6.32372 17.2614 3.14151C16.7141 2.59451 15.8636 3.44458 16.4109 3.99158C19.5984 7.17379 22.7858 10.356 25.9733 13.5345C26.5206 14.0815 27.3711 13.2314 26.8238 12.6844Z"
                    fill={clickprofile ? "#EAA881" : "#F5F5F5"}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_235_3983">
                    <rect width="30" height="30" fill="#f5f5f5" />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <Tooltip id="profile-tooltip" place="right">
              Profile
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="flex justify-center " ref={modelRef}>
        <svg
          className="relative cursor-pointer"
          onClick={() => setModel(!model)}
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
            fill="#f5f5f5"
          />
          <rect
            x="0.400391"
            y="7.3999"
            width="22.2"
            height="3.7"
            rx="1.85"
            fill="#f5f5f5"
          />
          <rect
            x="0.400391"
            y="14.8"
            width="22.2"
            height="3.7"
            rx="1.85"
            fill="#f5f5f5"
          />
        </svg>

        {model && (
          <div>
            <div>
              <div

                className="absolute py-[16px] px-3 text-center w-[180px] max-sm:w-[120px] max-md:w-[162px] 
                max-lg:w-[180px] max-sm:py-[10px] max-sm:px-1 z-50 max-sm:z-50 top-[88%]  
                left-[80%] max-sm:top-[70%] max-md:top-[83%]
                max-lg:top-[82%] max-xl:top-[84%] max-2xl:top-[85%] max-sm:left-[60%]
                rounded-[10px] bg-white cursor-pointer"
                onClick={() => handlechange()}
              >


                <div onClick={() => handleLogout()} className="mt-2">
                  <p className="font-montserrat font-medium leading-normal text-[15px] ">
                    Logout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BussinessSidebar;

