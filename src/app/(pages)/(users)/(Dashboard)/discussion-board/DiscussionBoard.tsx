"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
import BoardContent from "./BoardContent";
import "../../../../globals.css";
import { getDiscussions } from "@/app/components/utils/Helper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { selectPlaceDetails } from "@/app/redux/placesSlice";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { showMessage } from "@/app/components/reuseables/Notification";

import {
  setDiscussion,
  loadDiscussionsFromCookies,
} from "@/app/redux/discussionsSlice";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";

interface ProfileData {
  nickName?: string | null;
  image?: any;
}
const DiscussionBoard = () => {
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useTokenRedirect();


  const dispatch = useDispatch();
  const placeDetails = useSelector(selectPlaceDetails);
  const data = useSelector(
    (state: RootState) => state?.userProfile
  ) as ProfileData;
  const getDiscussionData = async () => {
    setIsLoading(true);
    try {
      const placeId: any = localStorage.getItem("businessId")

      const res = await getDiscussions(placeId ? placeId : placeDetails?.id);
      console.log('checkERROR', res)
      if (res?.status === 204) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setDiscussions(res?.data);
        dispatch(setDiscussion(res.data));
      }
    } catch (err) {
      if (err instanceof Error) {
        setIsLoading(false);
        showMessage(err.message || "Failed to fetch discussions", "error");
      } else {
        setIsLoading(false);
        showMessage("Failed to fetch discussions", "error");
      }
    }
  };
  useEffect(() => {
    getDiscussionData();
  }, []);
  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="flex min-h-screen bg-primary">
        <div className="flex flex-col w-full">
          <MainHeader
            title="Discussion Board"
            subtitle=""
            goto="/home"
            bg="purple"
            font="24px"
            paddding={true}
          />
          <div className="ml-28 max-sm:ml-0 md:ml-28 md:pr-[4rem]  pr-4  mt-5">
            <div className="flex justify-center">
              <div className="pt-5">
                <div className="flex items-center gap-5">
                  <div className="h-[68px] w-[68px]">
                    <Image
                      width={68}
                      height={68}
                      className="!h-[68px] !w-[68px] rounded-lg"
                      src={placeDetails?.images[0]}
                      alt="BenDen"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="font-montserrat text-2xl font-semibold leading-normal text-black">
                      {placeDetails?.name}
                    </div>
                    <a
                      href={placeDetails?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2997FD" }}
                      className="font-montserrat text-xs font-semibold leading-normal"
                    >
                      {placeDetails?.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 ">
              <BoardContent
                items={discussions}
                data={data}
                placeDetails={placeDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscussionBoard;
