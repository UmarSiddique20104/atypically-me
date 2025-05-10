"use client";
import React, { useEffect, useState } from "react";
import BirdsIcon from "@/app/components/reuseables/Svgs/BirdsIcon";
import MailIcon from "@/app/components/reuseables/Svgs/MailIcon";
import Button from "@/app/components/reuseables/Svgs/Button";
import Link from "next/link";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import getAndDecryptCookie, { Encrytion, storeToken } from "@/app/lib/auth";
import { showMessage } from "@/app/components/reuseables/Notification";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import "../../../globals.css";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { useDispatch } from "react-redux";
import { saveUserProfileData } from "@/app/redux/users/profileSlice";
import { saveProfileData } from "@/app/redux/profileSlice";

const Upload = () => {
  const role = getAndDecryptCookie('Role');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const token = getAndDecryptCookie("AccessToken");

  const navigate = useRouter();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewImage(reader.result);
        showMessage("Profile Picture Upload Successfully");
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!image) {
      return showMessage('Please select profile picture to upload', 'error');
    }
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const formdata = new FormData();
    formdata.append("image", image ?? "");
    const requestOptions = createRequestOptions(
      role === "user" ? "PATCH" : "POST",
      headers,
      formdata
    );
    const url =
      role === "user"
        ? API_ENDPOINTS.USERUPLOADPROFILE
        : API_ENDPOINTS.EDITPROFILE;

    try {
      const result = await fetchApi(url, requestOptions);
      handleApiResponse(result);
    } catch (error) {
      console.error("GetDeals error:", error);
      setIsLoading(false);
    }
  };

  const dispatch = useDispatch();

  const handleApiResponse = (result: any) => {
    if (role === "user" || (result?.success && result?.status === 200)) {
      setIsLoading(false);
      const imageData = previewImage; // use the preview image URL instead of the file
      if (role === "user") {
        dispatch(saveUserProfileData({ image: imageData }));
      } else {
        //@ts-ignore
        dispatch(saveProfileData({
          image: imageData
        }));
      }
      navigate.push(role === "user" ? "/face-challenges" : "/business/dashboard");
    } else {
      showMessage(result?.message, "error");
      console.error("API Response Error:", result);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="bg-orange min-h-svh flex flex-col justify-center items-center relative">
        <div>
          <div className="flex pe-12 justify-center">
            <BirdsIcon />
          </div>
          <div
            className="rounded-[50%] cursor-pointer bg-[#F5F5F5] flex items-center justify-center w-[300px] h-[300px] lg:w-[322px] lg:h-[322px]"
            onClick={() =>
              document.getElementById("profile-picture-input")?.click()
            }
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className="rounded-full w-full h-full object-cover cursor-pointer"
              />
            ) : (
              <div className="text-center">
                <div className="font-montserrat font-[400] leading-normal text-[25px] text-black">
                  Upload a
                </div>
                <div className="font-montserrat font-[700] leading-[53.891px] text-[45px] text-black">
                  Profile
                  <br />
                  Picture
                </div>
              </div>
            )}
            <input
              id="profile-picture-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div
            onClick={() => uploadImage()}
            className="pt-8 flex justify-center"
          >
            <Button>Let’s Start</Button>
          </div>
        </div>
        <div className="absolute bottom-0 sm:right-0 sm:pr-12 sm:pb-12 pb-3 right-0  ">
          <MailIcon />
        </div>
      </div>
    </>
  );
};

export default Upload;
