
"use client";
import React, { useState, ChangeEvent, useCallback, useEffect, Suspense } from "react";
import Button from "@/app/components/reuseables/Svgs/Button";
import dummyImage from "../../../../../public/assets/images/dummyImage.png";
import Image from "next/image";
import Link from "next/link";
import BussinessEditHeader from "@/app/components/sidebar/BusinessHeader/BussinesEditHeader";
import "../../../globals.css";
import { createHeaders, createRequestOptions, fetchApi } from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { showMessage } from "@/app/components/reuseables/Notification";
import { useRouter, useSearchParams } from "next/navigation";
import validateFormData from "@/app/components/validators/deals";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { useSelector } from "react-redux";
import { Deal } from "@/types/deals";
import secureLocalStorage from "react-secure-storage";
import getAndDecryptCookie from "@/app/lib/auth";
import { RootState } from "@/app/redux/store";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";

interface DealsState {
  dealsList: Deal[];
}

function EditDeals() {
  const [image, setImage] = useState<any>('');
  const [selectImage, setSelectImage] = useState<Boolean>(false);

  const [previewImage, setPreviewImage] = useState<string | null>(useSelector((state: RootState) => state?.deals?.dealsList[0]?.image) || null);
  const [data, setData] = useState<any>(useSelector((state: RootState) => state.deals.dealsList[0]) || {});
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const dealId: any = searchParams.get("id");
  useTokenRedirect();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/welcome");
    }
  }, []);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setSelectImage(true)
      setImage(selectedImage);
      setPreviewImage(URL.createObjectURL(selectedImage));
    }
  };

  const navigate = useRouter();
  const dealsData = useSelector((state: RootState) => state.deals.dealsList);
  const img = useSelector((state: RootState) => state?.deals?.dealsList[0]?.image)

  useEffect(() => {
    setImage(img)
  }, [])
  const token = getAndDecryptCookie('AccessToken');

  const UpdateDeal = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const formdata = new FormData();
    const requestOptions = createRequestOptions("PUT", headers, formdata);
    formdata.append("discount", data.discount ?? "");
    formdata.append("offer", data.offer ?? "");
    formdata.append("dealNumber", data.dealNumber ?? "");
    formdata.append("title", data.title ?? "");
    if (image && selectImage) {
      formdata.append("image", image);
    }
    const url = `${API_ENDPOINTS.UPDATEDEAL}/${dealsData[0]?.id}`;
    try {
      const result = await fetchApi(url, requestOptions);
      handleApiResponse(result);
    } catch (error) {
      console.error("GetDeals error:", error);
      setIsLoading(false);
    }
  };

  const handleApiResponse = (result: any) => {
    if (result?.success && result?.status === 200) {
      showMessage(result?.message, 'success');
      navigate.push("/business/deals");
      setIsLoading(false);
    } else {
      showMessage(result?.message, "error");
      console.error("API Response Error:", result);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading &&
        <div className="w-full h-8 flex justify-center items-center">
          <div className="loaderScreen"><Loader /></div>
        </div>
      }
      <div className="flex max-sm:ps-0 max-sm:pt-36 ps-20 h-full">
        <div className="flex flex-col w-full ">
          <div className="max-sm:z-50 ">

          <BussinessEditHeader
            padding={true}
            mainTitle="Update a Deal"
            colour="bg-primary pt-3"
            addbtn="max-sm:hidden"
            linkclass="hidden"
          />

          </div>

          <div className="flex justify-center relative bg-primary items-center max-sm:px-4 max-sm:pt-8 max-md:pt-24 pt-28 py-5 w-full h-vh md:h-svh ">
            <div>
              <div className="w-full flex flex-col">
                <label htmlFor="imageUpload">
                  {/* Render default image */}
                  <Image
                    objectFit="cover"
                    src={previewImage || dummyImage}
                    className="!w-[306.538px] !h-[334.57px] max-sm:w-full object-cover rounded-[22.54px] cursor-pointer"
                    alt="image"
                    height={334.57}
                    width={306.538}
                    unoptimized
                  />
                  {/* Input field to select image */}
                  <input
                    type="file"
                    id="imageUpload"
                    name="image"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: "none" }}
                  />
                </label>
                <div className="absolute bg-black flex flex-col items-center py-3 w-[306.538px] rounded-t-[22.54px]">
                  {/* Input fields for user data */}
                  <input
                    type="text"
                    name="discount"
                    className="text-center font-inter px-10 placeholder:text-white placeholder:font-bold text-white outline-none font-bold bg-[#ffffff00] mx-23 w-[306.538px] text-[32px]"
                    value={data.discount || ""}
                    onChange={handleInputChange}
                    placeholder="Discount"
                  />
                  <input
                    type="text"
                    name="offer"
                    className="text-center font-inter placeholder:text-white placeholder:font-normal text-white outline-none font-normal bg-[#ffffff00] text-[16px]"
                    value={data.offer || ""}
                    onChange={handleInputChange}
                    placeholder="Offer"
                  />
                </div>
              </div>
              <div className="relative">
                <div className="absolute right-[35%] bottom-[-10px] text-white text-center bg-black rounded-[4px]">
                  <input
                    type="text"
                    name="dealNumber"
                    className="text-center font-inter placeholder:text-white placeholder:font-normal px-[7px] w-[100px] text-white outline-none font-normal bg-[#ffffff00] text-[16px]"
                    value={data.dealNumber || ""}
                    onChange={handleInputChange}
                    placeholder="Deal 1"
                  />
                </div>
              </div>

              <div className="py-6">
                <input
                  type="text"
                  name="title"
                  className="text-center ps-4 font-inter placeholder:font-bold text-black placeholder:text-black outline-none bg-[#ffffff00] font-normal text-xl"
                  value={data.title || ""}
                  onChange={handleInputChange}
                  placeholder="Add Title..."
                />
              </div>
              <div className="mt-4 md:mt-2 text-center">
                <div onClick={UpdateDeal}>
                  <Button>Save</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function EditDealsWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditDeals />
    </Suspense>
  );
}