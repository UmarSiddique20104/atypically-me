"use client";
import React, { useEffect, useState } from "react";
import BusinessLogo from "../components/businessLogo";
import Image from "next/image";
import ImageMAp from "@/assets/images/mapImg.png";
import VerticalBelowSpaceCard from "../components/VerticalBelowSpaceCard";
import Popularity from "../components/Popularity";
import RateTheBusinessTemp from "../../components/reuseable/RateTheBusinessTemp";
import Reviews from "../../components/reuseable/Reviews";
import "../../../globals.css";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import DealsImage from "@/../public/assets/template/Temp5(1).svg";
import DealsImage2 from "@/../public/assets/template/Temp5(2).svg";
import DealsImage3 from "@/../public/assets/template/Temp5(3).svg";
import DealsImage4 from "@/../public/assets/template/Temp5(4).svg";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";
const deals2 = [
  { id: 1, src: DealsImage },
  { id: 2, src: DealsImage2 },
  { id: 3, src: DealsImage3 },
  { id: 4, src: DealsImage4 },
  { id: 5, src: DealsImage2 },
  { id: 6, src: DealsImage },
];

const Template5 = () => {
  const router = useRouter();
  const dealsList = useSelector(
    (state: RootState) => state.templatesData.dealsList
  );
  const [locPadding, setLocPadding] = useState("");
  const [locmargin, setLocMargin] = useState("");
  useTokenRedirect();
  useEffect(() => {
    const locationUrl = window.location.pathname;
    if (!locationUrl.includes("/business/select-template")) {
      setLocPadding("ps-24");
      setLocMargin("max-sm:mt-24");
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

  return (
    <div className={` max-sm:ps-0 ${locmargin} ${locPadding}`}>
      <div className=" min-h-svh  rounded-3xl  ">
        <BusinessLogo />

        <div className="container mx-auto">
          <div className="grid grid-cols-12 items-center  py-5  ">
            {deals?.length > 0 ? (
              <>
                {deals?.slice(0, 6)?.map((props: any, index: number) => (
                  <div
                    className=" xl:col-span-2 lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12  ps-2 pe-3"
                    key={index}
                  >
                    <VerticalBelowSpaceCard
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
                <div className=" col-span-12  w-full  flex flex-wrap  gap-4 2xl:justify-center  justify-start  items-start ScrollBar_custom">
                  {deals2.map((item: any, index: any) => (
                    <Link href={"/business/add-deals"} key={index}>
                      <div className="    h-full lg:w-48 w-40 " key={index}>
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
              </>
            )}
          </div>

          <hr className="border-t-2  border-dotted  border-black -mt-[2px] mb-2" />

          <div className="w-full">
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
              <Image
                src={ImageMAp}
                height={100}
                width={100}
                className={"bg-transparent"}
                alt="image"
                unoptimized
              />
            </div>
            <div className=" py-10 text-start ps-3">
              <h4 className="text-black text-base font-bold  font-inter ">
                {profile?.name}
              </h4>
              <p className="  text-black text-xs font-normal font-montserrat">
                {profile?.location}
                <br />
              </p>
            </div>
          </div>

          <hr className="border-t-2  border-dotted  border-black -mt-[2px] mb-2" />

          {/* First */}

          <div className=" grid grid-cols-12 gap-5 px-3">
            <div className="lg:col-span-6 col-span-12">
              <h3 className=" text-black text-base flex  font-bold font-inter justify-center items-center ">
                Reviews
              </h3>

              <div className=" pt-10 lg:border-r-2 ">
                <Reviews data={average} count={count} />
              </div>
            </div>

            <div className="lg:col-span-6 col-span-12">
              <h3 className=" text-black text-base flex font-bold  font-inter justify-center items-center ">
                Rate this business
              </h3>

              <div className=" py-10">
                <RateTheBusinessTemp data={average} count={count} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template5;
