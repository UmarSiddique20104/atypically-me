'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ImageIcon from "@/assets/images/getImageIcon.png";
import BusinessLogo from "./businessLogo";
import LogoImageTemp03 from "./LogoImageTemp-03";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { createHeaders, createRequestOptions, fetchApi } from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import getAndDecryptCookie from "@/app/lib/auth";
import { showMessage } from "@/app/components/reuseables/Notification";
import { useRouter } from "next/navigation";
const LogoBannerTemp3 = () => {
  const [state, setState] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [getMainBanner, setGetMainBanner] = useState('')

  const token = getAndDecryptCookie('AccessToken');
  const userId = getAndDecryptCookie('Id');
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
    getProfileData()
  }, [])
  const router = useRouter();
  return (
    <>
      {isLoading && <div className="loaderScreen">
        <Loader />
      </div>}
      <div>
        <div className="  relative   h-80">
          <div className=" flex justify-center items-center w-full">
            <div className="   w-full  ">
              <div className="flex flex-col justify-center items-center">
                {getMainBanner ?
                  <div className="!h-[250px] !w-full">
                    <Image height={250} width={600}
                             onClick={()=>router.push("/business/edit-banner")}
                      src={getMainBanner ? getMainBanner : ImageIcon}
                      unoptimized
                      className="!h-[250px] !w-full mb-[23.57px] object-cover cursor-pointer" alt=".." />
                  </div>
                  :
                  <div      onClick={()=>router.push("/business/edit-banner")} className="flex   cursor-pointer justify-center items-center text-white text-xl font-bold font-montserrat leading-normal border border-solid rounded-2xl bg-[#c2bebe] border-transparent !h-[221px] !w-full mb-[23.57px]">
                    + Upload Deal Banner
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="absolute bottom-0   left-1/2 transform -translate-x-1/2   ">
            <div className="">
              <LogoImageTemp03 />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoBannerTemp3;
