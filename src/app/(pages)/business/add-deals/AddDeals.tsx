"use client";
import React, { useState, ChangeEvent, useCallback, useEffect } from "react";
import Button from "@/app/components/reuseables/Svgs/Button";
import dummyImage from "../../../../../public/assets/images/dummyImage.png";
import Image from "next/image";
import Link from "next/link";
import BussinessEditHeader from "@/app/components/sidebar/BusinessHeader/BussinesEditHeader";
import "../../../globals.css";
import { createHeaders, createRequestOptions, fetchApi } from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { showMessage } from "@/app/components/reuseables/Notification";
import { useRouter } from "next/navigation";
import validateFormData from "@/app/components/validators/deals";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import getAndDecryptCookie from "@/app/lib/auth";
import secureLocalStorage from "react-secure-storage";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";

interface FormData {
  discount?: string;
  offer?: string;
  title?: string;
  dealNumber?: string;

}

function AddDeals() {
  const [image, setImage] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [data, setData] = useState<any>({});
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  useTokenRedirect();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Update the data state with user input
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const token = getAndDecryptCookie('AccessToken');

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    // Update the image state with the selected image URL
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setPreviewImage(URL.createObjectURL(selectedImage))
    }
  };
  const navigate = useRouter()

  const CreateDeals = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const formdata = new FormData();
    const requestOptions = createRequestOptions("POST", headers, formdata);
    formdata.append("discount", data.discount ? data.discount : "");
    formdata.append("offer", data.offer ? data.offer : " ");
    formdata.append("dealNumber", data.dealNumber ? data.dealNumber : " ");
    formdata.append("title", data.title ?? "");
    formdata.append("image", image ?? "");
    const url = API_ENDPOINTS.CREATEDEALS;

    try {
      const result = await fetchApi(url, requestOptions);
      handleApiResponse(result);
    } catch (error) {
      console.error('GetDeals error:', error);
      setIsLoading(false);
    }

  };

  const handleApiResponse = (result: any) => {
    if (result?.success && result?.status === 201) {
      showMessage(result?.message);
      navigate.push('/business/deals')
      setIsLoading(false);
    } else {
      showMessage(result?.message, "error");
      console.error('API Response Error:', result);
      setIsLoading(false);
    }
  };
  const router = useRouter();
  // const token = getAndDecryptCookie("AccessToken");
  useEffect(() => {
    if (!token) {
      router.push("/welcome");
    }
  }, []);
  return (
    <>
      {isLoading &&
        <div className="w-full h-8 flex justify-center items-center">
          <div className="loaderScreen"><Loader /></div>
        </div>
      }
      <div className="flex max-sm:ps-0 ps-20 min-h-svh ">
        <div className="flex flex-col w-full ">
          <BussinessEditHeader
            padding={true}
            mainTitle="Add a Deal"
            colour="bg-primary pt-3"
            addbtn="max-sm:hidden"
            linkclass="hidden"
          />

          <div className="flex justify-center relative bg-primary items-center max-sm:px-2 max-sm:pt-24 max-md:mt-20 mt-20 py-5 w-full h-full">
            <div>
              <div className="w-full flex flex-col ">
                <label htmlFor="imageUpload">
                  {/* Render default image */}
                  <Image
                    objectFit="cover"
                    src={previewImage || dummyImage}
                    className="!w-[306.538px] !h-[334.57px]
                    max-sm:w-full  object-cover rounded-[22.54px] cursor-pointer"
                    alt="image"
                    height={324.57}
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
                    className="text-center font-inter px-10 placeholder:text-white placeholder:font-bold text-white outline-none font-bold bg-[#ffffff00] mx-23 w-[306.538px] text-[32px] bg-"
                    value={data.discount || ""}
                    onChange={handleInputChange}
                    placeholder="Discount"
                  />
                  <input
                    type="text"
                    name="offer"
                    className="text-center font-inter placeholder:text-white placeholder:font-normal text-white outline-none font-normal bg-[#ffffff00] text-[16px] bg-"
                    value={data.offer || ""}
                    onChange={handleInputChange}
                    placeholder="Offer"
                  />
                </div>
              </div>
              <div className="relative">
                <div className="absolute right-[35%] bottom-[-10px]  text-white text-center bg-black  rounded-[4px] ">
                  <input
                    type="text"
                    name="dealNumber"
                    className="text-center font-inter placeholder:text-white placeholder:font-normal px-[7px] w-[100px]  text-white outline-none font-normal bg-[#ffffff00] text-[16px] bg-"
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
                  className="text-center ps-4 font-inter placeholder:font-bold text-black placeholder:text-black outline-none bg-[#ffffff00] font-normal text-xl bg-"
                  value={data.title || ""}
                  onChange={handleInputChange}
                  placeholder="Add Title..."
                />
              </div>
              <div className="mt-4 md:mt-2 text-center">
                <div onClick={() => CreateDeals()}>
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

export default AddDeals;
