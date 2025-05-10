"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import EditSvg from "@/app/components/reuseables/Svgs/editSvgs/EditSvg";
import Parachute from "@/app/components/reuseables/Svgs/editSvgs/Parachute";
import Crown from "@/app/components/reuseables/Svgs/editSvgs/Crown";
import Star from "@/app/components/reuseables/Svgs/editSvgs/Star";
import Flower from "@/app/components/reuseables/Svgs/editSvgs/Flower";
import "../../../../globals.css";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { showMessage } from "@/app/components/reuseables/Notification";
import getAndDecryptCookie from "@/app/lib/auth";
import Button from "@/app/components/reuseables/Svgs/Button";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { useDispatch } from "react-redux";
import { saveUserProfileData } from "@/app/redux/users/profileSlice";
import NoImg from "../../../../../../public/assets/images/noimgpic.jpeg";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";
const ProfileContent = () => {
  const [aboutMeEdit, setAboutMeEdit] = useState(false);
  const [interestsEdit, setInterestsEdit] = useState(false);
  const [favPlacesEdit, setFavPlacesEdit] = useState(false);
  const [aboutMe, setAboutMe] = useState("");
  const [interests, setInterests] = useState("");
  const [favPlaces, setFavPlaces] = useState("");

  const [fNameEdit, setfNameEdit] = useState(false);
  const [lNameEdit, setlNameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [fName, setFname] = useState("");
  const [lName, setLname] = useState("");
  const [email, setEmail] = useState("");

  const [username, setUsername] = useState("");
  const [usernameEdit, setUsernameEdit] = useState(false);
  const [imageEdit, setImageEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [image, setImage] = useState<any | null>(null);

  const token = getAndDecryptCookie("AccessToken");
  useTokenRedirect();

  const handleUsernameEdit = () => {
    setUsernameEdit(!usernameEdit);
  };

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };
  const handleAboutMeEdit = () => {
    setAboutMeEdit(!aboutMeEdit);
  };

  const handleInterestsEdit = () => {
    setInterestsEdit(!interestsEdit);
  };

  const handleFavPlacesEdit = () => {
    setFavPlacesEdit(!favPlacesEdit);
  };


  const handleFirstNameEdit = () => {
    setfNameEdit(!fNameEdit);
  };

  const handleLastNameEdit = () => {
    setlNameEdit(!lNameEdit);
  };

  const handleEmailEdit = () => {
    setEmailEdit(!emailEdit);
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageEdit(true);
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  const getProfileData = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GET_USER_PROFILE}`;

    try {
      const result = await fetchApi(url, requestOptions);
      const { attributes } = result?.data[0];
      dispatch(saveUserProfileData(attributes));
      setIsLoading(false);
      const data = result?.data[0]?.attributes;
      setUsername(data?.nickName);
      setPreviewImage(data?.image);
      setAboutMe(data?.aboutMe);
      setInterests(data?.interests);
      setFavPlaces(data?.favourites);
      setEmail(data?.email);
      setFname(data?.firstName);
      setLname(data?.lastName);
    } catch (error) {
      console.error("GetDeals error:", error);
      setIsLoading(false);
    }
  };
  const updateProfile = async () => {
    setIsLoading(true);
    if (image) {
      updateImage();
    }
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      data: {
        attributes: {
          firstName: fName,
          lastName: lName,
          nickName: username,
          aboutMe: aboutMe,
          interests: interests,
          favourites: favPlaces,
        },
      },
    });

    const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(API_ENDPOINTS.GET_USER_PROFILE, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false);
        handleApiResponse(result);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };
  const dispatch = useDispatch();

  const updateImage = async () => {
    const headers = createHeaders(token ?? "");
    const formdata = new FormData();
    formdata.append("image", image ?? "");

    const requestOptions = createRequestOptions("PATCH", headers, formdata);
    const url = API_ENDPOINTS.GET_USER_PROFILE;
    try {
      const result = await fetchApi(url, requestOptions);
      const { attributes } = result.data;
      dispatch(saveUserProfileData(attributes));
    } catch (error) {
      console.error("GetDeals error:", error);
      setIsLoading(false);
    }
  };

  const handleApiResponse = (result: any) => {
    setIsLoading(false);
    showMessage("Profile updated successfully");
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="max-w-full mx-auto p-6 relative">
        <div className="absolute top-[8%] left-[5%] max-md:hidden">
          <Parachute />
        </div>
        <div className="flex flex-col md:flex-row ">
          <div className="md:w-1/3 mb-[48px] max-sm:md-[0px]">
            <div className="space-y-6 flex  justify-center items-center">
              <div className="md:mt-48">
                <div className="font-montserrat text-[26px] font-extrabold pb-1 leading-normal text-black placeholder:text-black text-center">
                  Profile
                </div>
                <div
                  className="rounded-[50%] cursor-pointer bg-[#F5F5F5]"
                  onClick={() =>
                    document.getElementById("profile-picture-input")?.click()
                  }
                >
                  {previewImage ? (
                    <div>
                      <Image
                        src={previewImage}
                        width={225}
                        height={225}
                        className="w-[255.688px] rounded-[13.198px] object-cover h-[225.688px] cursor-pointer"
                        alt={".."}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image
                        src={NoImg}
                        className="w-[255.688px] rounded-[13.198px] h-[225.688px] cursor-pointer"
                        width={225}
                        height={225}
                        alt={".."}
                        unoptimized
                      />
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
                <div className="flex w-[100%]   items-center overflow-hidden justify-center pt-2 gap-1">
                  <input
                    type="text"
                    placeholder="Name"
                    className={`font-montserrat w-[40%]  ${username.length >= 15 ? "w-[90%]" : "w-[60%]"
                      } ps-2   placeholder:text-sm place ${username.length >= 15 ? "text-sm" : "text-base"
                      }  focus:outline-none font-medium  leading-normal text-black placeholder:text-black border-none ${usernameEdit ? "bg-white" : "bg-transparent"
                      }`}
                    value={username}
                    onChange={handleUsernameChange}
                    readOnly={!usernameEdit}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute left-[5%] top-[330px] max-md:hidden">
            <Star />
          </div>
          <div className="absolute right-[60%] 2xl:right-[68%] md:2xl:right-[70%] top-80  max-md:hidden">
            <Flower />
          </div>
          <div className="md:w-2/3 md:pl-12 max-sm:pt-5">
            <form className="space-y-4">

              <div className="flex sm:flex-row max-sm:flex-col gap-5 items-center">
                <div className="w-full">
                  <h3 className="text-lg font-semibold flex items-center space-x-2 pb-3 w-full">
                    <span className=" font-montserrat text-[26px]  font-extrabold leading-normal text-black placeholder:text-black ">
                      First Name
                    </span>
                    <span className="cursor-pointer" onClick={handleFirstNameEdit}>
                      {" "}
                      <EditSvg />
                    </span>
                  </h3>
                  <div className="">
                    <input
                      className="px-[10px] py-[12px] relative ps-6 rounded-[18px] w-full sm:w-[100%] font-roboto font-[400] leading-normal text-[17.101px] placeholder-[#000] bg-orange-darker placeholder:text-black placeholder:opacity-[50%]"
                      required
                      placeholder={"First name"}
                      type={"text"}
                      name={"searchplace"}
                      readOnly={!fNameEdit}
                      value={fName}
                      onChange={(e) => setFname(e.target.value)}
                    />
                  </div>

                </div>

                <div className="w-full">
                  <h3 className="text-lg font-semibold flex items-center space-x-2 pb-3">
                    <span className=" font-montserrat text-[26px]  font-extrabold leading-normal text-black placeholder:text-black ">
                      Last Name
                    </span>
                    <span className="cursor-pointer" onClick={handleLastNameEdit}>
                      {" "}
                      <EditSvg />
                    </span>
                  </h3>
                  <div className="">
                    <input
                      className="px-[10px] py-[12px] relative ps-6 rounded-[18px] w-full sm:w-[100%] font-roboto font-[400] leading-normal text-[17.101px] placeholder-[#000] bg-yellow placeholder:text-black placeholder:opacity-[50%]"
                      required
                      placeholder={"Last name"}
                      type={"text"}
                      name={"searchplace"}
                      readOnly={!lNameEdit}
                      value={lName}
                      onChange={(e) => setLname(e.target.value)}
                    />
                  </div>

                </div>
              </div>
              <Image
                src={"/assets/images/line.png"}
                alt="line"
                width={645}
                height={0}
                className="py-5 w-full"
                unoptimized
              />


              <div>
                <h3 className="text-lg font-semibold flex items-center space-x-2 pb-3 pt">
                  <span className=" font-montserrat text-[26px]  font-extrabold leading-normal text-black placeholder:text-black ">
                    Email
                  </span>
                </h3>
                <div className="">
                  <input
                    className="px-[10px] py-[12px] relative ps-6 rounded-[18px] w-full sm:w-[100%] font-roboto font-[400] leading-normal text-[17.101px] placeholder-[#000] bg-green placeholder:text-black placeholder:opacity-[50%]"
                    required
                    placeholder={"Email"}
                    type={"text"}
                    readOnly={true}
                    name={"searchplace"}
                    value={email}
                  />
                </div>

              </div>
              <Image
                src={"/assets/images/line.png"}
                alt="line"
                width={645}
                height={0}
                className="py-5 text-center w-full"
                unoptimized
              />


              <div>
                <h3 className="text-lg font-semibold flex items-center space-x-2 pb-3">
                  <span className=" font-montserrat text-[26px]  font-extrabold leading-normal text-black placeholder:text-black ">
                    About me
                  </span>
                  <span className="cursor-pointer" onClick={handleAboutMeEdit}>
                    {" "}
                    <EditSvg />
                  </span>
                </h3>
                <div className="  ">
                  <textarea
                    className={`w-full h-36 border rounded-[18px] p-5 focus:outline-none font-montserrat text-lg font-medium leading-normal text-black bg-orange-darker placeholder:text-black placeholder:opacity-[50%]`}
                    placeholder="About me"
                    readOnly={!aboutMeEdit}
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                  ></textarea>
                </div>

              </div>
              <Image
                src={"/assets/images/line.png"}
                alt="line"
                width={645}
                height={0}
                className="py-5 text-center w-full"
                unoptimized
              />

              <div>
                <h3 className="text-lg font-semibold flex items-center space-x-2 pb-3">
                  <span className=" font-montserrat text-[26px] font-extrabold  leading-normal text-black placeholder:text-black ">
                    Interests
                  </span>
                  <span
                    className="cursor-pointer"
                    onClick={handleInterestsEdit}
                  >
                    {" "}
                    <EditSvg />
                  </span>
                </h3>
                <div className="  ">
                  <textarea
                    className={`w-full h-36 border rounded-[18px] p-5 focus:outline-none
                                 font-montserrat text-lg font-medium leading-normal text-black bg-yellow placeholder:text-black placeholder:opacity-[50%] `}
                    placeholder="Interests"
                    readOnly={!interestsEdit}
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <Image
                src={"/assets/images/line.png"}
                alt="line"
                width={645}
                height={0}
                className="py-5 text-center w-full"
                unoptimized
              />

              <div>
                <h3 className="text-lg font-semibold flex items-center  space-x-2 pb-3">
                  <span className=" font-montserrat text-[26px] font-extrabold leading-normal text-black placeholder:text-black ">
                    Favourite places
                  </span>
                  <span
                    className="cursor-pointer"
                    onClick={handleFavPlacesEdit}
                  >
                    {" "}
                    <EditSvg />
                  </span>
                </h3>
                <div className="">
                  <textarea
                    className={`w-full h-36 border rounded-[18px] p-5 focus:outline-none font-montserrat text-lg font-medium leading-normal text-black bg-green placeholder:text-black placeholder:opacity-[50%] `}
                    placeholder="Favourite places"
                    readOnly={!favPlacesEdit}
                    value={favPlaces}
                    onChange={(e) => setFavPlaces(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="absolute bottom-[30%] left-[5%]  max-md:hidden">
          <Crown />
        </div>
      </div>
      {(aboutMeEdit ||
        interestsEdit ||
        favPlacesEdit ||
        usernameEdit ||
        fNameEdit ||
        lNameEdit ||
        imageEdit) && (
          <div className="mt-10 text-center">
            <div>
              <Button onClick={() => updateProfile()}>Save</Button>
            </div>
          </div>
        )}
    </div>
  );
};

export default ProfileContent;
