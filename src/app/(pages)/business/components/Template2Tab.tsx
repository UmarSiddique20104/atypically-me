"use client";
import React, { useEffect, useState } from "react";
import Lollipop from "./lollipop";
import ImageIcon from "@/assets/images/getImageIcon.png";
import HorizontalDiscountCard from "./HorizontalDiscountCard";
import RateTheBusinessTemp from "../../components/reuseable/RateTheBusinessTemp";
import Reviews from "../../components/reuseable/Reviews";
import Image from "next/image";
import "../../../globals.css";
import ImageMAp from "@/assets/images/mapImg.png";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Link from "next/link";
import useTemplatesData from "@/app/components/reuseables/useTemplatesData";

import DealsImage from "@/../public/assets/template/Temp2(1).svg";
import DealsImage2 from "@/../public/assets/template/Temp2(2).svg";
import DealsImage3 from "@/../public/assets/template/Temp2(3).svg";
import { useRouter } from "next/navigation";
const deals2 = [
  { id: 1, src: DealsImage },
  { id: 2, src: DealsImage2 },
  { id: 3, src: DealsImage3 },
  { id: 4, src: DealsImage },
  { id: 5, src: DealsImage2 },
];

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
      className={`tab font-inter py-2 cursor-pointer font-medium overflow-hidden  flex justify-center  items-center  ${
        props.isActive ? "active" : ""
      }`}
      onClick={() => props.onClick(props.id)}
    >
      <span className={`${props.isActive ? "text-[#007042]" : ""}`}>
        {props.label}
      </span>
    </div>
  );
}

function Tabse(props: any) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (id: any) => {
    setActiveTab(id);
  };

  return (
    <div className="w-full  overflow-hidden  ">
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
      <hr className="border-t-2 w-auto border-dotted  border-black -mt-[2px] mb-2" />
      <div>
        <div className="  ">{props.tabs[activeTab].content}</div>
      </div>
    </div>
  );
}

export default function Template2Tab() {
  const router = useRouter();
  const { GetTemplatesData } = useTemplatesData();
  const dealsList = useSelector(
    (state: RootState) => state.templatesData.dealsList
  );
  const [locPadding, setLocPadding] = useState("");

  useEffect(() => {
    GetTemplatesData();
  }, []);
  useEffect(() => {
    const locationUrl = window.location.pathname;
    if (!locationUrl.includes("/business/select-template")) {
      setLocPadding("ps-24 max-sm:ps-0");
    } else {
      setLocPadding("");
    }
  }, []);

  if (!dealsList) {
    return null;
  }
  //@ts-ignore
  const profile = dealsList?.userProfile;
  //@ts-ignore
  const reviews = dealsList?.reviews;
  //@ts-ignore
  const deals = dealsList?.deals;
  //@ts-ignore
  const average = dealsList?.average;
  //@ts-ignore
  const count = dealsList?.count;

  const googleMapsUrl = `https://www.google.com/maps?q=${profile?.longitude},${profile?.latitude}`;

  const tabs = [
    {
      label: "Popularity",
      content: (
        <div className=" w-[100%] overflow-hidden ">
          <div className="flex justify-center ">
            <div className="  md:flex block md:justify-around overflow-hidden justify-center items-center py-10">
              <p className="text-black text-xs font-light font-inter flex justify-center px-4 pt-2">
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
              <p className="text-black text-[15px] font-light flex justify-center  font-varela">
                Lollipops{" "}
              </p>
            </div>
          </div>
          <hr className="border-t-2 overflow-hidden  border-dotted  border-black -mt-[2px] mb-2" />
          <div className="grid grid-cols-12 items-center overflow-hidden py-2 gap-5 pt-5 sm:px-4 px-3  pb-10">
            {deals?.length > 0 ? (
              <>
                {deals?.slice(0, 6).map((props: any, index: any) => (
                  <div className="lg:col-span-6  col-span-12" key={index}>
                    <HorizontalDiscountCard
                      mainHeading={props?.discount}
                      subHeading={props?.offer}
                      image={props?.image}
                      title={props?.title}
                      bgColor={props?.bgColor}
                      dispatchData={props}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className=" col-span-12  w-full  pt-5  ">
               <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 sm:pe-5">

                    {deals2.map((item: any, index: any) => (
                      <Link href={"/business/add-deals"} key={index}>

                      <div className=" h-full w-full" >
                        
                        <Image
                          onClick={() => router.push("/business/add-deals")}
                          src={item.src}
                          className=" w-full h-full cursor-pointer object-cover"
                          height={500}
                          width={500}
                          alt="Deals"
                        />
                      </div>
                      </Link>
                    ))}
               </div>
                  
                </div>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      label: "Reviews",
      content: (
        <div>
          <div className=" ">
            <h3 className=" text-black text-base flex  font-bold font-inter justify-center items-center ">
              Reviews
            </h3>

            <div className=" pt-10 lg:border-r-2 ">
              <Reviews data={average} count={count} />
            </div>
          </div>

          <div className=" pt-10 max-sm:pt-4">
            <h3 className=" text-black text-base flex font-bold  font-inter justify-center items-center ">
              Rate this business
            </h3>

            <div className=" py-10 max-sm:py-4">
              <RateTheBusinessTemp data={average} count={count} />
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Location",
      content: (
        <div>
          <h3 className=" text-black text-base flex font-bold  font-inter justify-center items-center ">
            Location
          </h3>
          <div className="sm:flex block justify-around items-center py-10">
            <div className="   text-start ps-3">
              <h4 className="text-black text-base font-bold  font-inter">
                {profile?.name}
              </h4>
              <p className="  text-black text-xs font-normal font-montserrat">
                {profile?.location}
                <br />
              </p>
            </div>

            <div className=" flex   flex-col justify-center items-center">
              <p className="text-sky-600 text-xs font-bold font-inter py-2">
                Directions
              </p>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={googleMapsUrl}
                passHref
              >
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
      ),
    },
  ];

  return (
    <div className={` max-sm:ps-0  ${locPadding} overflow-hidden`}>
      <Tabse tabs={tabs} reviews={reviews} />
    </div>
  );
}
