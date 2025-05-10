"use client"
import React, { useState } from "react";
import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
import "../../../../globals.css";
import UserChat from "./UserChat";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { selectPlaceDetails } from "@/app/redux/placesSlice";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";

function MainChat() {
  const [option, setOption] = useState(null);
  const discussions = useSelector((state) => state.discussions.discussions);
  const DataItem = discussions[0]
  useTokenRedirect();

  const searchParams = useSearchParams();
  const OutingName = searchParams.get('name');
  const questionerName = searchParams.get('questionerName');
  const placeDetails = useSelector(selectPlaceDetails);

  return (
    <div className="flex flex-col w-full  bg-primary ">
      <div className="  bg-primary fixed z-40 md:top-0 top-0 flex flex-col w-full">
        {/* Main Header */}
        <MainHeader
          title={`${placeDetails?.name}`}
          subtitle={`${OutingName}`}
          goto="/home"
          bg="purple"
          font="24px"
          paddding={true}
        />
      </div>
      <div className="pt-32  overflow-hidden">
        <UserChat />
      </div>
    </div>
  );
}

export default MainChat;
