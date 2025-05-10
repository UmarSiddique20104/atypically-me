"use client";
import React, { useState } from "react";
import Lollipop from "./lollipop";
import ImageIcon from "@/assets/images/getImageIcon.png";
import HorizontalDiscountCard from "./HorizontalDiscountCard";
import RateTheBusinessTemp from "../components/reuseable/RateTheBusinessTemp";
import Reviews from "../components/reuseable/Reviews";
import Image from "next/image";
import "@/app/globals.css"
import ImageMAp from "@/assets/images/mapImg.png";

import dealdummy from "../../../../../../../../public/assets/images/dummyImage.png"
import Link from "next/link";
export const verticleProps = [
  {
    mainHeading: "Discount Offer",
    subHeading: "Body copy",
    image: ImageIcon,
    bgColor: "#E59261",
  },
  {
    mainHeading: "Discount Offer",
    subHeading: "Body copy",
    image: ImageIcon,
    bgColor: "#AFCBA2",
  },
  {
    mainHeading: "Discount Offer",
    subHeading: "Body copy",
    image: ImageIcon,
    title: "Add Title...",
    bgColor: "#F3D146",
  },
  {
    mainHeading: "Discount Offer",
    subHeading: "Body copy",
    image: ImageIcon,
    bgColor: "#95ABCC",
  },
  {
    mainHeading: "Discount Offer",
    subHeading: "Body copy",
    image: ImageIcon,
    bgColor: "#E59261",
  },
];
function Tab(props: any) {
  return (
    <div
      className={`tab font-inter py-2 w-full cursor-pointer font-medium  flex justify-center  items-center ${
        props.isActive ? "active" : ""
      }`}
      onClick={() => props.onClick(props.id)}
    >
      <span>{props.label}</span>
    </div>
  );
}

function Tabse(props: any) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (id: any) => {
    setActiveTab(id);
  };

  return (
    <div className="w-full ">
      <div className="flex justify-around">
        {props.tabs.map((tab: any, index: any) => (
          <Tab
            key={index}
            id={index}
            label={tab.label}
            isActive={activeTab === index}
            onClick={handleTabClick}
          />
        ))}
      </div>
      <hr className="border-t-2  border-dotted  border-black -mt-[2px] mb-2" />
      <div>
        <div className="  ">{props.tabs[activeTab].content}</div>
      </div>
    </div>
  );
}

 

 
export default function MainFunction(data: any) {

  const location = data?.data?.data?.userProfile 
  const polularity = data?.data?.data?.count
  const average = data?.data?.data?.average
  const googleMapsUrl = `https://www.google.com/maps?q=${location?.longitude},${location?.latitude}`;
 
 
  const tabs = [
    {
      label: 'Popularity',
      content: <Poluparity data={data}  />
    },
    {
      label: 'Reviews',
      content: <ReviewsTab average={average} polularity={polularity}/>
    },
    {
      label: 'Location',
      content: (
        <div>
          <h3 className="text-black text-base flex font-bold font-inter justify-center items-center">
            Location
          </h3>
          <div className="sm:flex block justify-around items-center py-10">
            <div className="text-start ps-3">
              <h4 className="text-black text-base font-bold font-inter">
              {location?.name}
              </h4>
              <p className="text-black text-xs font-normal font-montserrat">
      
                {location?.location}
                
                <br />
              </p>
              <p className="text-black text-xs font-normal font-montserrat max-w-96">
          
              </p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-sky-600 text-xs font-bold font-inter py-2">
                Directions
              </p>


              <Link target="_blank" rel="noopener noreferrer" href={googleMapsUrl} passHref>
                <Image
                  src={ImageMAp}
                  height={100}
                  width={100}
                  className="bg-transparent"
                  alt="map image"
                  unoptimized
                />
              </Link>
          
            </div>
          </div>
        </div>
      )
    },
  ];

  return (
    <div>
      <Tabse tabs={tabs} />
    </div>
  );
}


export const Poluparity = ({ data }: { data: any }) => {
  const deals =data?.data?.data?.deals
  const reviews = data?.data?.data?.reviews
  return(
    <>
     <div className=" w-full">
        <div className="flex  justify-center ">
          <div className=" flex flex-col justify-around items-center  pb-10">
            <p className="text-black text-xs font-light font-inter flex justify-center px-4  ">
              This business received:
            </p>
            <h4 className="text-black text-[83px] font-normal flex justify-center  font-varela">
            {reviews?.length}
            </h4>
            <div className="flex justify-center md:px-4">
              <Lollipop />
              <Lollipop />
              <Lollipop />
              <Lollipop />
              <Lollipop />
            </div>
            <p className="text-black text-base font-light flex justify-center  font-varela pt-3">
              Lollipops 
            </p>
          </div>
        </div>
        <hr className="border-t-2  border-dotted  border-black -mt-[2px] mb-2" />
        <div className="grid grid-cols-12 items-center gap-5 pt-5    pb-10">
          {deals?.map((props:any, index:number) => (
            <div className="lg:col-span-6 col-span-12" key={index}>
              <HorizontalDiscountCard
                mainHeading={props?.offer}
                subHeading={props?.discount}


                image={props?.image ? props?.image : dealdummy} 
              />
            </div>
          ))}
        </div>
      </div>
      </>
  )
}


export const ReviewsTab =({average,polularity }:any)=>{
 
  return(
    <>
      <div>
  
  <div className=" ">
    <h3 className=" text-black text-base flex  font-bold font-inter justify-center items-center ">
      Reviews 
    </h3>

    <div className=" pt-10 lg:border-r-2 ">
   <Reviews reviews={polularity} average={average}/>
    </div>
  </div>

  <div className=" pt-10">
    <h3 className=" text-black text-base flex font-bold  font-inter justify-center items-center ">
      Rate this business 
    </h3>

    <div className=" py-10">
   <RateTheBusinessTemp/>
    </div>
  </div>

</div> 
 
    </>
  )
}