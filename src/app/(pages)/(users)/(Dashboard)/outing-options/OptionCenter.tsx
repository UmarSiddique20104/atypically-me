'use client'
import CustomLollipop from "@/app/(pages)/business/components/reuseable/Customlolipop";

import CustomInActivelolipop from "@/app/(pages)/business/components/reuseable/CustomInActivelolipop";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import bar2 from "../../../../../../public/assets/images/bar-2.png";
import bar3 from "../../../../../../public/assets/images/bar3.png";
import bar4 from "../../../../../../public/assets/images/bar4.png";
import { User } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { getGooglePlacesById, getUserGeolocation } from "@/app/components/utils/Helper";
import getAndDecryptCookie from "@/app/lib/auth";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import Lollipop from "../selectedTemplate/[id]/components/lollipop";
import Inactivepop from "../selectedTemplate/[id]/components/lollipopInactive";
import { showMessage } from "@/app/components/reuseables/Notification";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { setPlaceDetails } from "@/app/redux/placesSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";

interface OptioncenterProps {
  selectedUser: User | null;
}
interface RatingResponse {
  // Define your response type here
}
const Optioncenter: React.FC<OptioncenterProps> = ({ selectedUser }) => {
  const [details, setDetails] = useState<User>();
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [givenRatings, setGivenRatings] = useState<any>();
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    getGooglePlaces();
  }, [isRatingSubmitting, selectedUser, setDetails]);



  const token = getAndDecryptCookie('AccessToken');


  const getGooglePlaces = async () => {
    setIsLoading(true)
    try {
      const loc = await getUserGeolocation();
      const requestOptions = {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          latitude: loc?.latitude,
          longitude: loc?.longitude
        }
      };

      const response = await axios.get(`${API_ENDPOINTS.PLACES}/${selectedUser?.id}`, requestOptions);
      if (response.status == 200) {
        const attributes = response.data.data.attributes;

        const transformedData: User = {
          id: attributes.placeId,
          name: attributes.name,
          rating: attributes.placeRatings?.averageRating || 0,
          totalRatings: attributes.placeRatings?.numberOfRatings || 0,
          type: attributes.types[0],
          distance: attributes.distance || 0,
          images: attributes.images,
          address: attributes.formattedAddress,
          open: attributes.openingHours?.open_now || false,
          openingTime: attributes.openingHours?.periods[0]?.open?.time,
          closingTime: attributes.openingHours?.periods[0]?.close?.time,
          website: attributes.website,
          url: attributes.url,
          ratingPercentage: attributes.placeRatings?.percentages,
          isRated: attributes.placeRatings?.isRated,
          userRatings: attributes.placeRatings?.userRating,
          image: "",
        };
        dispatch(setPlaceDetails(transformedData));
        setDetails(transformedData)
        setGivenRatings(transformedData?.rating - 1)
        setIsLoading(false)

      } else {
        setIsLoading(false)
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      setIsLoading(false)
      console.error("===========err=========>", error);
    }
  };

  const searchParams = useSearchParams();
  const OutingName = searchParams.get('name');

  const router = useRouter();
  const handleClick = (id:any) => {
    router.push(`/ask-a-question?name=${OutingName}`);
  
    localStorage.setItem("businessId",id )
  };
  const isBarFilled = (barIndex: any) => {
    return details?.rating === (barIndex + 1);
  };
  const handleRate = async (rating: any) => {
    setGivenRatings(rating);
    try {
      const placeId = details?.id;
      const newRating = rating + 1;
      const res: AxiosResponse<RatingResponse> = await axios.post<RatingResponse>(
        API_ENDPOINTS.RATINGS,
        {
          data: { attributes: { rating: newRating, placeId } },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        getGooglePlaces();
        return showMessage('You have Rated this location Successfully');
      } else {
        console.log('Else error occurred');
        throw new Error('Failed to rate place');
      }
    } catch (error) {
      console.log('error occurred', error);

      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || 'Failed to rate place');
      } else {
        throw new Error('Failed to rate place');
      }
    }
  };


  const openGoogleMaps = () => {
    if (details && details.url) {
      window.open(details.url, '_blank');
    } else {
      console.error("URL is undefined or details is null");
    }
  };


  if (!selectedUser) {
    return (
      <div className="py-3">Please select a user to view their details.</div>
    );
  }

  return (
    <>
      {isLoading && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className=" md:pt-[13.95px] pt-28 max-sm:pt-0 max-sm:px-[30px] max-md:px-[70px]  pb-[15.11px] px-[60px]">
        <div className="md:flex block my-[12.79px] justify-between items-center rounded-[11.624px]">
          <div className="topic-item flex items-center gap-2">
            <div className="flex flex-col gap-[7.76px] w-full">
              <div className="font-montserrat !text-[24px] font-semibold leading-normal text-black text-xs">
                {details?.name}
              </div>
              <div className="flex items-center justify-start gap-3">
                <div className="font-montserrat !text-[15px] font-normal leading-normal text-black text-xs">
                  {details?.rating?.toFixed(1)}
                </div>
                <div className="flex h-[11px]">
                  {details?.rating !== undefined && [...Array(5)].map((_, index) => {
                    return index < details.rating ? (
                      <CustomLollipop key={index} width={12} height={11} />
                    ) : (
                      <CustomInActivelolipop key={index} width={12} height={11} />
                    );
                  })}
                </div>
                <div className="font-montserrat !text-[15px] font-normal leading-normal text-black text-xs">
                  ({details?.totalRatings})

                </div>
              </div>
              <div className="font-montserrat !text-[15px] font-normal leading-normal text-black text-xs">
                {details?.type} -{details?.distance?.toFixed(2)} mi

              </div>
              <div className="flex md:flex-nowrap flex-wrap  items-center gap-4 pt-5 pb-11 ">
                <button onClick={() => openGoogleMaps()} className="w-[128.875px] max-sm:w-full h-[31.157px] bg-black text-[14.545px] font-bold font-montserrat text-white rounded-full me-[3px]">
                  Directions
                </button>
                <button
                  onClick={() => handleClick(details?.id)}
                  className="w-[128.875px] max-sm:w-full h-[31.157px] text-[14.545px] font-bold font-montserrat text-black border-[#000] border-solid border-[1.455px] rounded-full"
                >
                  Ask a Question
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className=" flex  items-center flex-wrap gap-[11.31px]">
          {details?.images?.map((item, index) => {
            return <div key={index} className="relative flex w-[190px] max-md:w-[176.214px] max-lg:w-[173.214px] h-[122px]  overflow-hidden rounded-[10px]">
              <Image
                src={item}
                alt="topicImage"
                layout="fill"
                objectFit="cover"
                className="cursor-pointer"
                unoptimized
              />

            </div>
          })}

        </div>
      </div>

      <div className="pt-8 !h-[200px]">
        <div className=" bg-[#F5F5F5] rounded-xl">
          <Tabs className="ratingOverviewTabs">
            <TabList className="flex justify-center md:gap-10 gap-8 items-center border-b-[1px]  border-black ">
              <Tab className=" md:w-[30%] bg-transparent w-[46%] font-montserrat text-center font-bold outline-none text-black !bg-primary cursor-pointer px-[18px]  py-[5.67px] ">
                Overview
              </Tab>
              <Tab className="md:w-[30%] bg-transparent w-[46%] font-montserrat text-center font-bold outline-none text-black   px-[18px] py-[5.67px] !bg-primary cursor-pointer">
                Ratings
              </Tab>
            </TabList>
            <TabPanel className=" px-[0.5px]">
              <div
                className="user-list"
                style={{ maxHeight: "660px", overflowY: "auto" }}
              >
                {/* <div className=" border-b-[1px] px-[60px]  border-[#000] border-solid py-[22px] font-montserrat font-medium text-[12px] leading-normal">
                  <p>You visited 4 weeks ago.</p>
                </div> */}
                <div className=" border-b-[1px] px-[60px] border-[#000] border-solid  py-[22px] font-montserrat font-medium text-[12px] leading-normal">
                  <p>{details?.address}</p>
                </div>
                <div className=" border-b-[1px] px-[60px] border-[#000] border-solid  py-[22px] font-montserrat font-medium text-[12px] leading-normal">
                  <div className="flex items-center gap-2">

                    <p className={`text-[${details?.open ? "#31BF51" : "#FF0505"}] ${details?.open ? "text-[#42f569]" : "text-[#FF0505]"} font-semibold pe-[3px]`}>
                      {details?.open ? "Open" : "Closed"}{" "}
                    </p>
                    <div>{details?.open ? "Closes" : "Opens"}{" "}
                      {moment(details?.open ? details?.closingTime : details?.openingTime).format("h:mm a")}
                    </div>
                  </div>
                </div>
                {details?.website &&
                  <div className=" border-b-[1px] px-[60px] border-[#000] border-solid  py-[22px]  font-montserrat font-medium text-[12px] leading-normal">

                    <a href={details?.website} target="_blank" className=" text-[#2997FD]">{details?.website}</a>
                  </div>
                }

                {/* <div className="py-[22px]  px-[60px] font-montserrat font-medium text-[12px] leading-normal flex gap-[59px]">
                  <div className="flex">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                      >
                        <path
                          d="M2.14417 4.25293C4.9615 6.96965 8.64272 9.99255 12.0841 12.2049"
                          stroke="#33C930"
                          stroke-width="3.97596"
                          stroke-linecap="round"
                        />
                        <path
                          d="M9.25354 2.26465C6.95692 5.23006 4.55881 8.94663 3.01899 12.2368"
                          stroke="#33C930"
                          stroke-width="3.97596"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                    <div>Pets</div>
                  </div>
                  <div className="flex pe-5">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                      >
                        <path
                          d="M2.14417 4.25293C4.9615 6.96965 8.64272 9.99255 12.0841 12.2049"
                          stroke="#33C930"
                          stroke-width="3.97596"
                          stroke-linecap="round"
                        />
                        <path
                          d="M9.25354 2.26465C6.95692 5.23006 4.55881 8.94663 3.01899 12.2368"
                          stroke="#33C930"
                          stroke-width="3.97596"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                    <div>Vegetarian food</div>
                  </div>
                </div> */}
              </div>
            </TabPanel>

            <TabPanel className="pt-[22px]">
              <div
                className="challenge-list"
                style={{ maxHeight: "660px", overflowY: "auto" }}
              >
                <div className="flex md:justify-start justify-center  flex-wrap gap-11 py-5 border-b-2 border-black border-solid">
                  <div className=" flex flex-col  px-[60px] ">
                    <p className="font-montserrat font-medium text-[40px] leading-normal ">
                      {details?.rating.toFixed(1)}
                    </p>
                    <div className="flex text-3xl">
                      {details?.rating !== undefined && [...Array(5)].map((_, index) => {
                        return index < details.rating ? (
                          <CustomLollipop key={index} width={17} height={11} />
                        ) : (
                          <CustomInActivelolipop key={index} width={17} height={11} />
                        );
                      })}
                    </div>
                    <div className="py-3 font-montserrat font-normal text-[15px] leading-normal">
                      <p className="px-3">({details?.totalRatings})</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:w-[463px] w-full sm:px-0 px-3">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="w-[100%] pb-[22px]">
                        <div className="w-[100%] bg-[#D9D9D9] rounded-full h-2.5 mb-4 ">
                          <div
                            className="h-2.5 rounded-full dark:bg-blue-500"
                            style={{ width: isBarFilled(index) ? '100%' : '0%', backgroundColor: isBarFilled(index) ? '#E2669A' : 'transparent' }}
                          ></div>
                        </div>
                      </div>
                    )).reverse()}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="py-5">
                    <div className="flex justify-center flex-col items-center">
                      <div className="">
                        <p className="font-montserrat font-bold text-[15px] leading-normal">
                          Rate this business
                        </p>
                      </div>
                      <div>
                        <p className="font-montserrat font-normal text-[12px] leading-normal">
                          Share your experience to help others
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center  justify-center mt-3 cursor-pointer">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span key={index}
                          onClick={() => handleRate(index)}
                        >
                          {givenRatings >= index ? <Lollipop /> : <Inactivepop />}
                        </span>
                      ))}
                    </div>


                  </div>
                </div>

              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Optioncenter;