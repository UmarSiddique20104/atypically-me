import React from "react"; 
import Image from "next/image"; 
import ImageMAp from "@/assets/images/mapImg.png";
 
import SixImagesBanner from "../components/SixImagesBanner";
import SideIconDiscountCard from "../components/SideIconDiscountCard";
import Reviews from "../components/reuseable/Reviews";
import RateTheBusinessTemp from "../components/reuseable/RateTheBusinessTemp";
import Popularity from "../components/Popularity";
import Link from "next/link";

import dealdummy from "../../../../../../../../public/assets/images/dummyImage.png"
 
import "../components/styles.css" 

const Page = (data: any) => {
  const deals = data?.data?.deals;

  const reviews = data?.data?.reviews;
  const count = data?.data?.count;
  const location = data?.data?.userProfile;
  const average = data?.data?.average;
 
  const googleMapsUrl = `https://www.google.com/maps?q=${location?.longitude},${location?.latitude}`;
 
  return (
    <div className="bg-primary xl:ps-[6rem] max-sm:pt-24 ">
      <div className="min-h-svh shadow-2xl rounded-[37px] ">
        <SixImagesBanner data={data} />

        <div className="xl:container mx-auto px-1 overflow-x-hidden">
  

          <div className=" flex overflow-x-scroll px-3 py-5 max-xl:ps-24  max-sm:ps-0 "> 
              {deals?.map((props: any, index: number) => (
                <div key={index} className="px-3 min-w-96   ">
                  <SideIconDiscountCard
                    mainHeading={props?.offer}
                    subHeading={props?.discount}
                    image={props?.image ? props?.image : dealdummy}
                  />
                </div>
              ))}
        
          </div>
    


          <hr className="border-t-2  border-dotted  border-black -mt-[2px] mb-2" />

          <div className=" grid grid-cols-12 gap-5 max-[1280px]:ms-24 max-sm:ms-0">
            <div className="lg:col-span-6  col-span-12">
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

          <hr className="border-t-2  border-dotted  border-black -mt-[2px] mb-2" />

          <div className=" w-full">
            <Popularity reviews={reviews} />
          </div>

          <hr className="border-t-2  border-dotted  border-black -mt-[2px] mb-2" />

          <h3 className=" text-black text-base flex font-bold  font-inter justify-center items-center  ">
            Location
          </h3>
          <div className="sm:flex block justify-around items-center py-10">
            <div className=" text-start  ps-3">
              <h4 className="text-black text-base font-bold  font-inter">
                {location?.name}
              </h4>
              <p className="  text-black text-xs font-normal font-montserrat">
                {location?.location}
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
      </div>
    </div>
  );
};

export default Page;