"use client";
import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
import React, { useEffect } from "react";
import HomeCenterContent from "./HomeCenterContent";
import HomeRightContent from "./HomeRightContent";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import { saveUserProfileData } from "@/app/redux/users/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import getAndDecryptCookie from "@/app/lib/auth";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { RootState } from "@/app/redux/store";
import { ProfileData } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import QRScanner from "../../../../../../public/assets/images/QRScanner.png";
import QRCode from "react-qr-code";

const HomeContent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = getAndDecryptCookie("AccessToken");

  const getProfileData = async () => {
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GET_USER_PROFILE}`;

    try {
      const result = await fetchApi(url, requestOptions);
      const { attributes } = result?.data[0];
      dispatch(saveUserProfileData(attributes));
    } catch (error) {
      console.error("GetDeals error:", error);
    }
  };
  const data = useSelector(
    (state: RootState) => state?.userProfile
  ) as ProfileData;

  const url = `https://app.atypicallyme.com/user-profile?name=${encodeURIComponent(data?.nickName ?? "")}`;
  // const url = `https://atypicallyme.vercel.app/user-profile?name=${encodeURIComponent(data?.nickName ?? "")}`;

  useEffect(() => {
    getProfileData();
    const role = getAndDecryptCookie("Role");
    if (role === "user") {
      return;
    } else {
      router.push("/welcome");
    }
  }, []);


  return (
    <>
      <div className="fixed bottom-3 z-10 right-0 m-4 w-40 h-40 bg-white object-cover shadow-xl">
        <div className="flex justify-center items-center w-full h-full">
          <QRCode
            value={url}
            size={110} // Size of the QR code
            bgColor={"#ffffff"} // Background color
            fgColor={"#000000"} // Foreground color
            level={"M"} // Error correction level (L, M, Q, H)
          />
        </div>
      </div>
      <div className="flex bg-primary max-sm:px-4 max-md:ps-32 ps-28 max-md:pe-10 pe-5">
        <div className="fixed top-0 z-10 left-0 bg-primary p-4 max-[425px]:pt-24 max-sm:pt-24 max-sm:px-4 max-sm:py-2 ps-28 pe-10 max-lg:pe-[0.75rem] flex flex-col w-full">
          {/* Main Header */}
          <MainHeader
            title={data.nickName ?? ""}
            subtitle="Welcome to Atypically me"
            goto=""
            bg=""
            font="20px"
            paddding={false}
          />
        </div>
        <div className="flex flex-row max-lg:flex-col max-[424px]:mt-7  max-sm:pt-7 gap-5 md:pb-14 md:pt-14 pb-4 pt-40 w-full">
          <div className="flex-1 overflow-y-auto">
            {/* Center content */}
            <div className="w-full">
              <HomeCenterContent />
            </div>
          </div>

          {/* Right content */}
          <div className=" w-1/3 max-lg:w-full overflow-y-auto">
            <div className="">
              <HomeRightContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeContent;
