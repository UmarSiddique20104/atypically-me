"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ImageIcon from "@/assets/images/getImageIcon.png";
import Tabs from "../components/Template1Tabs";
import BusinessLogo from "../components/businessLogo";
import "../../../globals.css"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import useTemplatesData from "@/app/components/reuseables/useTemplatesData";
import getAndDecryptCookie from "@/app/lib/auth";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { createHeaders, createRequestOptions, fetchApi } from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { showMessage } from "@/app/components/reuseables/Notification";
import { useRouter } from "next/navigation";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";

const Template1 = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [getMainBanner, setGetMainBanner] = useState('')
  const [locPadding, setLocPadding] = useState('')
  const [locmargin, setLocMargin] = useState('')

  const dealsList = useSelector((state: RootState) => state.templatesData.dealsList);
  //@ts-ignore
  const userProfile = dealsList?.userProfile;
  const token = getAndDecryptCookie('AccessToken');
  const userId = getAndDecryptCookie('Id');
  useTokenRedirect();
  const { GetTemplatesData } = useTemplatesData();

  const getProfileData = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GETSINGLEPROFILE}/${userId}`;

    try {
      const result = await fetchApi(url, requestOptions);

      if (result?.success && result?.status === 200) {
        setGetMainBanner(result?.data?.mainBannerImage)
        setIsLoading(false);
      } else {
        showMessage(result?.message, "error");
        console.error('API Response Error:', result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('GetDeals error:', error);
      setIsLoading(false);
    }
  };


  useEffect(() => {
    GetTemplatesData()
    getProfileData()
    const locationUrl = window.location.pathname
    if (!locationUrl.includes('/business/select-template')) {
      setLocPadding('ps-24 max-sm:ps-0 ')
      setLocMargin('max-sm:mt-24')
    } else {
      setLocPadding('')
    }
  }, [])

  return (
    <>
      {isLoading && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className={` ${locmargin}`}>
        <div className=" min-h-svh  ">
          <div className="  4xl:container mx-auto  ">
            <BusinessLogo />
            <div className="relative flex justify-center items-center w-full pt-5 ">
              <div className=" w-full ">
                <div className="flex flex-col justify-center items-center">
                  {getMainBanner ?
                    <Image height={221} width={600}
                    onClick={()=>router.push("/business/edit-banner")}
                      src={getMainBanner ? getMainBanner : ImageIcon}
                      unoptimized
                      className="!h-[221px] !w-full mb-[23.57px] object-cover cursor-pointer" alt=".." />
                    :
                    <div   onClick={()=>router.push("/business/edit-banner")} className=" cursor-pointer flex justify-center items-center text-white text-xl font-bold font-montserrat leading-normal border border-solid rounded-2xl bg-[#c2bebe] border-transparent !h-[221px] !w-full mb-[23.57px]">
                      + Upload Deal Banner
                    </div>
                  }
                </div>
              </div>

            </div>

            <div className={`pt-3 ${locPadding}`}>
              <Tabs />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Template1;
