"use client";
import React, { useEffect, useState } from "react";
import Button from "@/app/components/reuseables/Svgs/Button";

import TreatsHeader from "@/app/components/sidebar/TreatsHeader/TreatsHeader";
import "../../../../globals.css";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import getAndDecryptCookie from "@/app/lib/auth";
import { showMessage } from "@/app/components/reuseables/Notification";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import ChangeTextInput from "@/app/components/reuseables/ChangeInputField";

import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";
const Suggesion = () => {
  const [businessName, setBusinessName] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const token = getAndDecryptCookie("AccessToken");
  const [data, setData] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  useTokenRedirect();

  const SuggestTheBusiness = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      businessName: businessName,
      category: categoryName,
      location: locationName,
    });

    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    setIsLoading(true);
    const url = `${API_ENDPOINTS.POST_SUGGESTION_FOR_BUSINESS}`;
    try {
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result?.success && result?.status === 201) {
            showMessage(result?.message);
            setIsLoading(false);
          } else {
            showMessage(result?.message, "error");
            console.error("API Response Error:", result);
            setIsLoading(false);
          }
        });
    } catch (error) {
      console.error("GetDeals error:", error);
      setIsLoading(false);
    }
  };
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [inputValue, setInputValue] = useState<any>("");
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const onLoad = (autocomplete: any) => {
    setAutocomplete(autocomplete);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const [mapLoad, setMapLoad] = useState<boolean>(true);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY ?? "";
  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (place && place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setSelectedLocation(location);
        const address = place?.formatted_address;
        setInputValue(address);
        setLocationName(address);
      }
    }
  };
  const handleSubmit = () => {
    if (
      businessName != "" &&
      categoryName != "" &&
      locationName != "" &&
      selectedLocation.lat != 0 &&
      selectedLocation.lng != 0
    ) {
      SuggestTheBusiness();
    } else {
      showMessage("Please fill all the fields", "error");
    }
  };

  const handleSelectedOption = (option: any) => {
    setSelectedOption(option);
  };
  const getData = async (token: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.GET_ALLBUSINESS_USER, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch topics: ${res.statusText}`);
      }
      const result = await res.json();
      setIsLoading(false);
      setData(result?.data?.users);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching topics:", error);
    }
  };

  const filterDeals = () => {
    return data.filter((deal) =>
      deal.businessCategory.toLowerCase().includes(selectedOption.toLowerCase())
    );
  };

  useEffect(() => {
    getData(token);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="w-full h-8 flex justify-center items-center">
          <div className="loaderScreen">
            <Loader />
          </div>
        </div>
      )}
      <div className="flex w-svw h-svh bg-lightOrange max-sm:ps-6 max-sm:pe-6 max-md:ps-24 lg:ps-24 ps-28  max-md:pe-10 pe-5 overflow-x-hidden">
        <div className="fixed w-svw top-0 left-0 z-20 p-4 ps-32 max-sm:ps-6 max-sm:pe-6 max-[424px]:ps-7 pe-10 flex flex-col ">
          <TreatsHeader
            goto="/special-treats"
            onSelectedOptionChange={handleSelectedOption}
          />
        </div>
        <div className=" flex justify-center w-svw z-10 max-sm:pt-72 max-md:pt-72 max-lg:pt-64 mx-auto ">
          <div className=" lg:pt-60 md:pb-14 md:pt-14 pb-4  px-2 w-[90svw]  lg:px-auto ">
            <ChangeTextInput
              placeholder="Business Category"
              type="text"
              name="category"
              onChange={(event) => setBusinessName(event.target.value)}
            />
            <ChangeTextInput
              placeholder="Business Name"
              type="text"
              name="name"
              onChange={(event) => setCategoryName(event.target.value)}
            />

            <div>
              <div className=" relative  max-sm:pt-7  pt-14 ">
                {mapLoad && (
                  <LoadScript
                    googleMapsApiKey={apiKey}
                    libraries={["places", "geometry", "visualization"]}
                  >
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={handlePlaceSelect}
                    >
                      <input
                        autoComplete="off"
                        className="px-[10px] py-[10px] text-center rounded-[48px] w-[90vw] 
                  max-sm:w-[100%] max-md:w-[84svw] max-lg:w-[82svw] max-xl:w-[70svw] max-2xl:w-[60svw] 2xl:w-[60svw]  font-montserrat font-[800]
                  leading-normal text-[17.101px] placeholder-[#000]  lg:mx-[110px] xl:mx-[230px] 2xl:mx-[280px]"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Select the location "
                      />
                    </Autocomplete>
                  </LoadScript>
                )}
              </div>
            </div>

            <div className="pt-14 text-center ">
              <span className=" cursor-pointer" onClick={handleSubmit}>
                <Button>Submit</Button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Suggesion;
