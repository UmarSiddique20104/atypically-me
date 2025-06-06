"use client";
import { RootState } from "@/app/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createHeaders, createRequestOptions, fetchApi } from "../../utils/Helper";
import API_ENDPOINTS from "../../ApiRoutes/apiRoutes";
import { saveUserProfileData } from "@/app/redux/users/profileSlice";
import getAndDecryptCookie from "@/app/lib/auth";

interface MainHeaderProps {
  title: string;
  subtitle: string;
  goto: string;
  bg: string;
  paddding: boolean;
  font: string;
}
interface ProfileData {
  nickName?: string | null;
  channelName?: string | null;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  title,
  subtitle,
  goto,
  bg,
  paddding,
  font,
}) => {
  const data = useSelector(
    (state: RootState) => state?.userProfile
  ) as ProfileData;
  const navigate = useRouter();
  const gobackfunc = () => {
    navigate.back();
  };

  const socket = useSelector((state: RootState) => state.sockets.socket);
  const token = getAndDecryptCookie("AccessToken");

  const getProfileData = async () => {
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GET_USER_PROFILE}`;

    try {
      const result = await fetchApi(url, requestOptions);
      const { attributes } = result?.data[0];
    } catch (error) {
      console.error("GetDeals error:", error);
    }
  };
  useEffect(() => {
    if (socket?.connected) {
      getProfileData();
    }
    socket?.on("notificationCount", (count) => {
      console.log('MAINHEADERCount', count)

    });
  }, [socket])

  return (
    <div
      className={`${paddding
        ? "ps-32 max-sm:ps-4 w-full  lg:pt-12 md:pt-12 md:pb-12  max-md:pt-12 lg:pb-12 max-md:pb-12 max-sm:pt-32 max-sm:pb-10"
        : ""
        } pe-10 ${subtitle === "Welcome to Atypically me" ? "max-sm:pe-1" : "max-sm:pe-4 "
        } ${bg ? `bg-${bg}` : ""} `}
    >
      <div className="flex justify-between flex-wrap items-center w-full ">
        {goto ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => gobackfunc()}
            width="14"
            height="18"
            viewBox="0 0 14 18"
            fill="none"
            className="cursor-pointer"
          >
            <path
              d="M0.477736 8.04908L9.69361 0.396686C10.3306 -0.132229 11.3606 -0.132229 11.9908 0.396686L13.5223 1.66833C14.1592 2.19725 14.1592 3.05252 13.5223 3.5758L6.98983 9L13.5223 14.4242C14.1592 14.9531 14.1592 15.8084 13.5223 16.3317L11.9908 17.6033C11.3538 18.1322 10.3238 18.1322 9.69361 17.6033L0.477736 9.95092C-0.159244 9.43326 -0.159244 8.57799 0.477736 8.04908Z"
              fill="black"
            />
          </svg>
        ) : (
          ""
        )}
        <div>
          <h1
            className={`font-montserrat max-sm:text-base font-[700] leading-normal text-[${font ? font : "20px"
              }] text-black`}
          >
            {title}
          </h1>

          {subtitle && title && (
            <p className="font-montserrat text-center font-[500] leading-normal text-[15px] text-black">
              {subtitle}
            </p>
          )}
        </div>
        <div className="">
          <svg
            width="149"
            height="56"
            // className="w-full"
            // viewBox="0 0 149 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.1883 28L16.4297 23.7455H7.21161L5.45307 28H0.744729L9.59414 8.14555H14.1323L23.0101 28H18.1883ZM8.68651 20.2568H14.9832L11.8349 12.6553L8.68651 20.2568ZM33.2703 24.1426L34.4616 27.2625C33.554 27.9149 32.2209 28.2269 30.8594 28.2269C27.2573 28.2269 25.1584 26.3833 25.1584 22.7528V16.4844H22.8042V13.0808H25.1584V9.36518H29.5831V13.0808H33.3838V16.4844H29.5831V22.696C29.5831 24.0007 30.2922 24.7098 31.4834 24.7098C32.1358 24.7098 32.7882 24.5113 33.2703 24.1426ZM47.56 12.7404H51.8145L44.9222 28.936C43.4473 32.6232 41.3484 33.7294 38.5971 33.7294C37.0371 33.7294 35.3353 33.2189 34.3426 32.3396L35.9593 29.1913C36.6401 29.7869 37.5761 30.1556 38.4553 30.1556C39.675 30.1556 40.3557 29.6167 40.9513 28.2553L41.008 28.1135L34.3993 12.7404H38.9659L43.2488 23.0931L47.56 12.7404ZM62.6396 12.5135C66.9225 12.5135 70.2411 15.5768 70.2411 20.3702C70.2411 25.1637 66.9225 28.2269 62.6396 28.2269C60.7393 28.2269 59.1793 27.6313 58.0448 26.3833V33.5025H53.62V12.7404H57.8462V14.499C58.9524 13.1659 60.5975 12.5135 62.6396 12.5135ZM61.8738 24.5964C64.0862 24.5964 65.7596 23.008 65.7596 20.3702C65.7596 17.7324 64.0862 16.1441 61.8738 16.1441C59.6615 16.1441 57.988 17.7324 57.988 20.3702C57.988 23.008 59.6615 24.5964 61.8738 24.5964ZM75.4154 10.6132C73.7703 10.6132 72.6641 9.53536 72.6641 8.14555C72.6641 6.75574 73.7703 5.67793 75.4154 5.67793C77.0605 5.67793 78.1667 6.69901 78.1667 8.06046C78.1667 9.53536 77.0605 10.6132 75.4154 10.6132ZM73.203 28V12.7404H77.6278V28H73.203ZM89.1088 28.2269C84.1451 28.2269 80.5997 24.9651 80.5997 20.3702C80.5997 15.7753 84.1451 12.5135 89.1088 12.5135C92.3138 12.5135 94.8382 13.9033 95.9444 16.3993L92.5124 18.243C91.6898 16.7964 90.4702 16.1441 89.0804 16.1441C86.8397 16.1441 85.0811 17.7041 85.0811 20.3702C85.0811 23.0364 86.8397 24.5964 89.0804 24.5964C90.4702 24.5964 91.6898 23.9724 92.5124 22.4975L95.9444 24.3695C94.8382 26.8087 92.3138 28.2269 89.1088 28.2269ZM104.647 12.5135C109.298 12.5135 111.993 14.6692 111.993 19.2924V28H107.852V26.0996C107.029 27.4895 105.441 28.2269 103.2 28.2269C99.6265 28.2269 97.4993 26.2415 97.4993 23.6037C97.4993 20.9091 99.3996 19.0371 104.051 19.0371H107.568C107.568 17.1368 106.434 16.0306 104.051 16.0306C102.435 16.0306 100.761 16.5695 99.6549 17.4488L98.0665 14.3572C99.74 13.1659 102.208 12.5135 104.647 12.5135ZM104.306 25.2487C105.781 25.2487 107.058 24.568 107.568 23.1782V21.6182H104.533C102.463 21.6182 101.811 22.384 101.811 23.4051C101.811 24.5113 102.747 25.2487 104.306 25.2487ZM115.998 28V6.95429H120.422V28H115.998ZM124.529 28V6.95429H128.953V28H124.529ZM143.952 12.7404H148.206L141.314 28.936C139.839 32.6232 137.74 33.7294 134.989 33.7294C133.429 33.7294 131.727 33.2189 130.734 32.3396L132.351 29.1913C133.032 29.7869 133.968 30.1556 134.847 30.1556C136.067 30.1556 136.747 29.6167 137.343 28.2553L137.4 28.1135L130.791 12.7404H135.357L139.64 23.0931L143.952 12.7404Z"
              fill="black"
            />
            <path
              d="M103.704 32.9354C107.335 32.9354 109.944 35.0343 109.944 39.6859V48.4219H105.52V40.3666C105.52 37.899 104.413 36.7645 102.626 36.7645C100.641 36.7645 99.2512 38.0408 99.2512 40.7637V48.4219H94.8265V40.3666C94.8265 37.899 93.777 36.7645 91.9334 36.7645C89.9763 36.7645 88.5865 38.0408 88.5865 40.7637V48.4219H84.1618V33.1623H88.388V34.9209C89.5225 33.6161 91.2243 32.9354 93.1814 32.9354C95.3087 32.9354 97.1239 33.7579 98.2017 35.4314C99.4214 33.8714 101.407 32.9354 103.704 32.9354ZM129.024 40.8488C129.024 41.1892 128.967 41.6714 128.939 42.0401H117.395C117.82 43.9404 119.437 45.1033 121.763 45.1033C123.38 45.1033 124.543 44.6212 125.592 43.6284L127.946 46.1812C126.528 47.7979 124.401 48.6488 121.649 48.6488C116.374 48.6488 112.942 45.3303 112.942 40.7921C112.942 36.2256 116.431 32.9354 121.082 32.9354C125.564 32.9354 129.024 35.9419 129.024 40.8488ZM121.111 36.2823C119.097 36.2823 117.65 37.5019 117.338 39.459H124.855C124.543 37.5303 123.096 36.2823 121.111 36.2823Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
