"use client"
import BussinessSidebar from "@/app/components/sidebar/BussinessSidebar";
import Image from "next/image";
import banner from "../../../../../public/assets/images/EditBanner.png";
import React, { useEffect, useState } from "react";
import Button from "@/app/components/reuseables/Svgs/Button";
import Link from "next/link";
import BussinessEditHeader from "@/app/components/sidebar/BusinessHeader/BussinesEditHeader";
import "../../../globals.css"
import getAndDecryptCookie, { Encrytion, storeToken } from "@/app/lib/auth";
import { showMessage } from "@/app/components/reuseables/Notification";
import { createHeaders, createRequestOptions, fetchApi } from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { useRouter } from "next/navigation";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import useProfileData from "@/app/components/reuseables/useProfileData";
import GetProfileData from "@/app/components/reuseables/GetProfileData";
import getProfileData from "@/app/components/reuseables/useProfileData";
import secureLocalStorage from "react-secure-storage";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";
function EditBanner() {
  const [mainBannerImage, setMainBannerImage] = useState('')
  const token = getAndDecryptCookie('AccessToken');
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [image, setImage] = useState<any | null>(null);

  const [getMainBanner, setGetMainBanner] = useState<any | null>(null);

  const router = useRouter();
  useTokenRedirect();
  // const token = getAndDecryptCookie("AccessToken");
  useEffect(() => {
    if (!token) {
      router.push("/welcome");
    }
  }, []); 
  useEffect(() => {
    const BannerImage = getAndDecryptCookie('BannerImage');
    setMainBannerImage(BannerImage ?? "")
    setPreviewImage(BannerImage ?? "")

  }, [])

  const handleGetProfileData = async () => {
    setIsLoading(true);
    try {
      const result = await getProfileData();
      if (result?.success && result?.status === 200) {
        setPreviewImage(result?.data?.mainBannerImage);
        setIsLoading(false);
      } else {
        showMessage(result?.message, "error");
        console.error('API Response Error:', result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Get Profile Data error:', error);
      setIsLoading(false);
    }
  };

  // Call the API when the component mounts
  useEffect(() => {
    handleGetProfileData();
  }, []);


  const EditMainBanner = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const formdata = new FormData();
    formdata.append("mainBannerImage", image ?? "");

    const requestOptions = createRequestOptions("POST", headers, formdata);
    const url = API_ENDPOINTS.EDITPROFILE;

    try {
      const result = await fetchApi(url, requestOptions);
      handleApiResponse(result);
    } catch (error) {
      console.error('GetDeals error:', error);
      setIsLoading(false);
    }

  };

  const navigate = useRouter()

  const handleApiResponse = (result: any) => {
    if (result?.success && result?.status === 200) {
      setIsLoading(false);
      navigate.push('/business/dashboard')
      showMessage('Banner updated Successfully')
    } else {
      showMessage(result?.message, "error");
      console.error('API Response Error:', result);
      setIsLoading(false);
    }
  };



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {

        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };


  return (
    <>
      {isLoading && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="flex  min-h-svh ps-20 max-sm:px-0 max-sm:mt-20">
        <div className="flex flex-col ps-[25px] pe-[10px] max-sm:px-[10px] w-full bg-primary ">
          <BussinessEditHeader padding={true} addbtn="max-sm:hidden" linkclass="hidden" mainTitle="Edit main Banner" colour="bg-[#f5f5f5]" />

          <div className="flex flex-col mt-[150px] px-10">
            <div>
              <div><p className="text-sm py-2 cursor-default">

                Click on the banner image to upload<span className="text-red-400">*</span>
              </p>
              </div>
              {/* <Image height={221} width={600} src={mainBannerImage ? mainBannerImage : banner} alt=".." unoptimized /> */}
              <div className='rounded-[50%] cursor-pointer bg-[#F5F5F5]' onClick={() => document.getElementById('profile-picture-input')?.click()}>
                {previewImage ? (
                  <div>
                    <Image
                      src={previewImage}
                      width={600}
                      height={221}
                      className="!h-[221px] !w-full mb-[23.57px] object-cover"
                      alt={".."}
                      unoptimized
                    />
                  </div>

                ) : (
                  <div className='text-center'>
                    <Image
                      src={banner}
                      width={600}
                      height={221}
                      className="!h-[221px] !w-full mb-[23.57px] object-cover"
                      alt={".."}
                      unoptimized
                    />
                  </div>
                )}
                <input id="profile-picture-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
            </div>
            <div className="mt-10 text-center">
              <div onClick={() => EditMainBanner()}>
                <Button>Update</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditBanner;
