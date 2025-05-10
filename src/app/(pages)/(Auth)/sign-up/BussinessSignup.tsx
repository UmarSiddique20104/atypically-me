"use client";
import TextInput from "../components/InputFields";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import GoogleIcon from "../../../components/reuseables/Svgs/GoogleIcon";
import FacobookIcon from "../../../../assets/svgs/auth/FacebookIcon.svg";
import Button from "../components/Button";
import Link from "next/link";
import CustomHeading from "@/app/components/reuseables/CustomHeading";
import { showMessage } from "@/app/components/reuseables/Notification";
import Dropdown from "@/app/components/reuseables/Dropdown";
import { useFormik } from "formik";
import { BusinessSchema } from "@/app/schema/BusinessSchema";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { useRouter, useSearchParams } from "next/navigation";
import secureLocalStorage from "react-secure-storage";

import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import getAndDecryptCookie, { Encrytion, storeToken } from "@/app/lib/auth";
import "../../../globals.css";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  placeId: string;
}
const BusinessSignup = () => {
  const router = useRouter();
  const options = [
    "Cafe",
    "Restaurant",
    "Apparel",
    "Entertainment",
    "Medical",
    "Sports",
  ];

  const [sectedOption, setSelectedOption] = useState<string>("");
  const [address, setAddress] = useState<Location>({
    latitude: 0,
    longitude: 0,
    address: "",
    placeId: "",
  });
  const [sectedOptionState, setSelectedOptionState] = useState(false);
  const [sectedLocation, setsSectedLocation] = useState(false);
  const role = secureLocalStorage.getItem("role");
  const handleClickFunction = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<any>([]);
  const token = getAndDecryptCookie("AccessToken");

  const initialValues = {
    bname: "",
    contactno: "",
    email: "",
    Password: "",
    CPassword: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: BusinessSchema,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: (values, action) => {
        setIsLoading(true);
        if (sectedOption === "") {
          setSelectedOptionState(true);
          return;
        }
        if (
          address.latitude === 0 &&
          address.longitude === 0 &&
          address.address === "" &&
          address.placeId === ""
        ) {
          setsSectedLocation(true);
          return;
        }
        setSelectedOptionState(false);
        const myHeaders = new Headers();
        myHeaders.append("Origin", "*");
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          data: {
            attributes: {
              businessName: values.bname,
              businessAddress: address,
              contactNo: values.contactno,
              email: values.email,
              password: values.Password,
              confirmPassword: values.CPassword,
              businessCategory: sectedOption,
              role: "business",
            },
          },
        });

        var requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        fetch(API_ENDPOINTS.REGISTRATION, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (
              result?.success &&
              (result?.status == 200 || result?.status == 201)
            ) {
              showMessage("Account created Successfully!");
              const Data = result?.data?.attributes;
              const authToken = Encrytion(result?.authToken);
              const Role = Encrytion(Data?.role);
              const Email = Encrytion(Data?.email);
              const BusinessName = Encrytion(Data?.businessName);
              const BusinessCategory = Encrytion(Data?.businessCategory);
              const ContactNo = Encrytion(Data?.contactNo);
              const Location = Encrytion(Data?.businessAddress?.address);
              const AboutMe = Encrytion(Data?.aboutMe);
              const address = Encrytion(Data?.businessAddress?.address);
              const latitude = Encrytion(
                JSON.stringify(Data?.businessAddress?.latitude)
              );
              const longitude = Encrytion(
                JSON.stringify(Data?.businessAddress?.longitude)
              );
              const placeId = Encrytion(Data?.businessAddress?.placeId);
              const Id = Encrytion(Data?.Id);

              storeToken("AccessToken", authToken);
              storeToken("Id", Id);
              storeToken("Role", Role);
              storeToken("BusinessName", BusinessName);
              storeToken("BusinessCategory", BusinessCategory);
              storeToken("ContactNo", ContactNo);
              storeToken("AboutMe", AboutMe);
              storeToken("Location", Location);
              storeToken("address", address);
              storeToken("latitude", latitude);
              storeToken("longitude", longitude);
              storeToken("placeId", placeId);
              storeToken("Email", Email);
              router.push("/upload-profile");
              setIsLoading(false);
            } else {
              setIsLoading(false);
              showMessage(result?.message, "error");
            }
          })
          .catch((error) => {
            setIsLoading(false);
            console.log(error);
          });
      },
    });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY ?? "";
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [inputValue, setInputValue] = useState<any>("");
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (place && place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        const BusinessAddress = {
          latitude: location.lat,
          longitude: location.lng,
          address: place.name,
          placeId: place.place_id,
        };
        setAddress(BusinessAddress);
        setSelectedLocation(location);
        setInputValue(place?.formatted_address);
        setsSectedLocation(false);
      }
    }
  };

  const onLoad = (autocomplete: any) => {
    setAutocomplete(autocomplete);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const [mapLoad, setMapLoad] = useState<boolean>(false);

  const GetCategories = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GETCATEGORY}`;
    try {
      const result = await fetchApi(url, requestOptions);
      if (result?.success && result?.status === 200) {
        const categories = result.data.map(
          (category: { category: string }) => category.category
        );
        setCategory(categories);
        setIsLoading(false);
      } else {
        showMessage(result?.message, "error");
        console.error("API Response Error:", result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("GetDeals error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMapLoad(true);
    GetCategories();
  }, []);

  return (
    <div className="bg-lightOrange min-h-[100vh] no-scrollbar overflow-y-scroll  flex justify-center items-center">
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="pt-[70px]">
        <CustomHeading FontWeight={700} title="Sign-up" />

        <form onSubmit={handleSubmit} className=" " noValidate>
          <div className="pt-[20px]">
            <div className="relative">
              <TextInput
                placeholder=""
                type="text"
                name="bname"
                value={values.bname}
                onChange={handleChange}
                onBlur={handleBlur}
                title={"Business Name"}
              />
              {errors.bname && touched.bname && (
                <p className=" absolute -bottom-5 ms-3 text-red-500 text-[14px] translate-y-1">
                  {errors.bname}
                </p>
              )}
            </div>
            <div>
              <div className=" relative sm:pt-[30px] pt-[30px]">
                {mapLoad && (
                  <LoadScript
                    googleMapsApiKey={apiKey}
                    libraries={["places", "geometry", "visualization"]}
                  >
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={handlePlaceSelect}
                    >
                      <div className="flex flex-col">
                        <label className="font-montserrat text-[17.5px] pl-2 leading-normal font-bold pb-2" htmlFor="">Business Address</label>
                        <input
                          autoComplete="off"
                          className="px-[10px] py-[10px] text-center rounded-[48px] w-[90vw] 
                                    sm:w-[640px] font-montserrat font-normal
                                    leading-normal text-[17.101px] placeholder-[#000]"
                          type="text"
                          value={inputValue}
                          onChange={handleInputChange}
                          placeholder=""
                        />
                      </div>
                    </Autocomplete>
                  </LoadScript>
                )}
                {sectedLocation ? (
                  <div className="flex justify-start absolute -bottom-5">
                    <p className="  ms-3 text-red-500 text-xs ">
                      Select a Location
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="relative">
              <Dropdown
                label="Business Category"
                options={category}
                active=""
                handleClick={handleClickFunction}
                twClass="#ffffff"
                color="#ffffff"
               
              />

              {sectedOptionState ? (
                <div className="flex justify-start">
                  <p className="  text-red-500 text-[14px] ">
                    Select a business Category
                  </p>
                </div>
              ) : null}

              {sectedOptionState && (
                <p className=" absolute -bottom-5 ms-3 text-red-500 text-[14px] translate-y-1">
                  {errors.contactno}
                </p>
              )}{" "}
            </div>

            <div className="relative">
              <TextInput
                placeholder=""
                type="text"
                name="contactno"
                value={values.contactno}
                onChange={handleChange}
                onBlur={handleBlur}
                title={"Contact No."}
              />
              {errors.contactno && touched.contactno && (
                <p className=" absolute -bottom-5 ms-3 text-red-500 text-[14px] translate-y-1">
                  {errors.contactno}
                </p>
              )}{" "}
            </div>

            <div className="relative">
              <TextInput
                placeholder=""
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                title={"Email"}
              />
              {errors.email && touched.email && (
                <p className=" absolute -bottom-5 ms-3 text-red-500 text-[14px] translate-y-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <TextInput
                placeholder=""
                type="password"
                name="Password"
                value={values.Password}
                onChange={handleChange}
                onBlur={handleBlur}
                title={"Password"}
              />
              {errors.Password && touched.Password && (
                <p className=" absolute -bottom-5 ms-3 text-red-500 text-[14px] translate-y-1">
                  {" "}
                  {errors.Password}
                </p>
              )}
            </div>

            <div className="relative">
              <TextInput
                placeholder=""
                type="password"
                name="CPassword"
                value={values.CPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                title={"Re-enter Password"}
              />
              {errors.CPassword && touched.CPassword && (
                <p className=" absolute -bottom-5 ms-3 text-red-500 text-[14px] translate-y-1">
                  {errors.CPassword}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center pt-[33px]">
            <Button>Register</Button>
          </div>
        </form>

        <div className="text-center">
          <div className="py-[20px]">
            <div className="font-montserrat font-[500] leading-normal text-[13px] text-black">
              Already have an Account?{" "}
              <span className="font-[700] cursor-pointer">
                <Link href={"/sign-in"} >SIGN IN</Link>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BusinessSignup;
