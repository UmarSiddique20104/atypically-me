import React from "react";
import Image from "next/image";
import ImageMAp from "@/assets/images/mapImg.png";
import "./styles.css"
import Link from "next/link";
import LogoBannerTemp3 from "./LogoBannerTemp-03";
import ButtomDiscountCard from "./ButtomDiscountCard";
import Reviews from "./reuseable/Reviews";
import RateTheBusinessTemp from "./reuseable/RateTheBusinessTemp";
import Popularity from "./Popularity";
import dummyImg from "@/assets/images/temp1logo.png"

import dealdummy from "../../../../../../../../public/assets/images/dummyImage.png"

const Template3 = ({ data }: any) => {
  const deals = data?.data?.deals
  const count = data?.data?.count
  const location = data?.data?.userProfile
  const reviews = data?.data?.reviews;
  const average = data?.data?.average
  const googleMapsUrl = `https://www.google.com/maps?q=${location?.longitude},${location?.latitude}`;

  return (
    <div className=" bg-primary xl:ps-24 max-sm:pt-24 ">
      <div className="min-h-svh  shadow-xl   rounded-[37px]  bg-primary ">
        <div className="">
          <LogoBannerTemp3 data={data} />
        </div>
        <div className="xl:container  mx-auto">
          <div className="py-5 w-full  xl:ps-0 ps-24 ">
            <div className=" flex custom-scrollbar-container  overflow-x-auto py-4    ">
              {deals?.map((props: any, index: number) => (
                <div key={index} className="px-3  ">
                  <ButtomDiscountCard
                    mainHeading={props?.offer}
                    subHeading={props?.discount}
                    image={props?.image ? props?.image : dealdummy}
                  />
                </div>
              ))}
            </div>

          </div>

          <hr className="border-t-2  border-dotted  border-black -mt-[2px] mb-2" />
          <div className="  w-full">
            <Popularity reviews={reviews} />
          </div>

          <hr className="border-t-2  border-dotted  border-black  mt-2 mb-2" />
          <div className="grid grid-cols-12 pt-10 sm:ms-24">
            <div className="lg:col-span-3 col-span-12 flex justify-center items-center">
              <h2 className="text-black text-base font-bold  text-start font-inter">
                Reviews
              </h2>
            </div>
            <div className="lg:col-span-9 col-span-12  ">
              <Reviews average={average} reviews={count} />
            </div>
          </div>

          {/* Second */}
          <div className="grid grid-cols-12 py-10 sm:ms-24">
            <div className="lg:col-span-3 col-span-12 flex justify-center items-center">
              <h2 className="text-black text-base font-bold  font-inter">
                Rate this Business
              </h2>
            </div>
            <div className="lg:col-span-9 col-span-12">
              <RateTheBusinessTemp />
            </div>
          </div>

          <hr className="border-t-2  border-dotted  border-black -mt-[2px] mb-2" />
          <div className="grid grid-cols-12 items-center  py-10">
            <div className=" lg:col-span-3 col-span-12 flex justify-center items-center">
              <h2 className="text-black text-base font-bold  font-inter">
                Location
              </h2>
            </div>
            <div className=" lg:col-span-9 col-span-12 sm:flex block justify-around sm:pt-0 pt-5  ">

              <div className="     ps-3 sm:pb-0 pb-10 ">
                <h4 className="text-black text-base font-bold  font-inter ">
                  {location?.name}
                </h4>
                <p className="  text-black text-xs font-normal font-montserrat">
                  {location?.location}
                  <br />
                </p>
              </div>

              <div className="   flex flex-col justify-center items-center">
                <p className="text-sky-600 text-xs font-bold font-interpy-2">
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
        </div>
      </div>
    </div>
  );
};

export default Template3;
