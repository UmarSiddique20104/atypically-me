"use client";
import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
import React, { useEffect, useState } from "react";
// import HomeCenterContent from './HomeCenterContent'
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
import HomeCenterContent from "./HomeCenterContent";

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
  const [option, setOption] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const paramsName = new URLSearchParams(window.location.search).get(
      "name"
    );

    const data = paramsName ? paramsName.replace(/<br\s*\/?>/gi, " ") : "";
    setOption(data)

  }, []);

  useEffect(() => {
    getProfileData();
    const role = getAndDecryptCookie("Role");
    if (role === "user") {
      return;
    } else {
      router.push("/sign-in");
    }
  }, []);

  const data = useSelector(
    (state: RootState) => state?.userProfile
  ) as ProfileData;

  return (
    <>
      {/* <div className="fixed bottom-3 z-10 right-0 m-4">
        <Image
          className="w-32 h-32 object-cover shadow-xl"
          src={QRScanner}
          width={140}
          height={200}
          alt="QR"
        />
      </div> */}
      <div className="flex flex-col bg-primary ">

        <div className="  flex flex-row max-lg:flex-col max-sm:px-4 pt-8 max-md:ps-32 ps-28 lg:h-[80svh] 2xl:h-[88.5svh] gap-5  w-full">
          <div className="flex-1 h-[70svh] 2xl:h-[80svh] no-scrollbar">
            {/* Center content */}
            <div className="w-full">
              <HomeCenterContent />
            </div>
          </div>

          {/* Right content */}
          <div className=" w-1/3 max-lg:w-full max-sm:overflow-hidden  lg:overflow-y-scroll no-scrollbar mt-10 pr-1">
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
