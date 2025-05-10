import React from "react";
import BusinessLogo from "../components/businessLogo";
import Image from "next/image";
import ImageMAp from "@/assets/images/mapImg.png";
import VerticalBelowSpaceCard from "../components/VerticalBelowSpaceCard";
import Popularity from "../components/Popularity";
import RateTheBusinessTemp from "../components/reuseable/RateTheBusinessTemp";
import Reviews from "../components/reuseable/Reviews";
import Link from "next/link";
 import  "../components/styles.css"
 import dummyImg from "@/assets/images/temp1logo.png"
 import dealdummy from "../../../../../../../../public/assets/images/dummyImage.png"
 
const Temp5 = ({data}: any) => {
   
  const deals = data?.data?.deals;
  const reviews = data?.data?.reviews;
  const count = data?.data?.count;
  const location = data?.data?.userProfile;
  const image = data?.data?.userProfile?.image
  const average = data?.data?.average;

  const googleMapsUrl = `https://www.google.com/maps?q=${location?.longitude},${location?.latitude}`;
  return (
    <div className="bg-primary xl:ps-28   max-sm:pt-24">
      <div className="min-h-svh shadow-2xl   rounded-[37px]">
        <div className="flex justify-center items-center py-5 w-full">
        <div className="flex justify-center items-center relative">
             <Image
            src={image  ? image : dummyImg}
            height={1000}
            width={1000}
            className={'rounded-full h-24 w-24 object-fill'}
            alt='image'
            unoptimized
            />
         
         
        </div>
      </div>
      <div className="flex justify-center items-center px-2">
        <h2 className="text-black text-xl  font-medium font-inter bg-transparent">
       {data?.data?.userProfile?.name}
        </h2>
        
      </div>

        <div className="3xl:container mx-auto max-[1280px]:ms-24 max-sm:ms-0">
        <div className="py-5 ">
        <div className=" flex custom-scrollbar-container overflow-x-auto py-4 max-sm:px-4   "> 
        
              {deals?.map((props: any, index: number) => (
             <div key={index} className=" px-3  min-w-96   ">
                  <VerticalBelowSpaceCard
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
          <hr className="border-t-2  border-dotted  border-black -mt-[2px] mb-2" />

          <h3 className=" text-black text-base flex  font-bold font-inter justify-center items-center ">
            Location
          </h3>
          <div className="md:flex block justify-center items-center gap-5 pb-10">
            <div className="flex flex-col justify-center items-center">
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
            <div className=" py-10 text-start ps-3">
              <h4 className="text-black text-base font-bold  font-inter ">
                {location?.name}
              </h4>
              <p className="  text-black text-xs font-normal font-montserrat">
                {location?.location}
                <br />
              </p>
            </div>
          </div>

          <hr className="border-t-2  border-dotted  border-black -mt-[2px] mb-2" />

          {/* First */}

          <div className=" grid grid-cols-12 gap-5">
            <div className="lg:col-span-6 col-span-12">
              <h3 className=" text-black text-base flex  font-bold font-inter justify-center items-center ">
                Reviews
              </h3>

              <div className=" pt-10 lg:border-r-2 ">
                <Reviews average={average} reviews={count} />
              </div>
            </div>

            <div className="lg:col-span-6 col-span-12">
              <h3 className=" text-black text-base flex font-bold  font-inter justify-center items-center ">
                Rate this business
              </h3>

              <div className=" py-10">
                <RateTheBusinessTemp />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temp5;
