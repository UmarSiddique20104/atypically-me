"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ImageMAp from "@/assets/images/mapImg.png";
import ButtomDiscountCard from "../components/ButtomDiscountCard";
import Lollipop from "../components/lollipop";
import LogoBannerTemp3 from "../components/LogoBannerTemp-03";
import Reviews from "../../components/reuseable/Reviews";
import RateTheBusinessTemp from "../../components/reuseable/RateTheBusinessTemp";
import "../../../globals.css";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import DealsImage from "@/../public/assets/template/Temp3(1).svg";
import DealsImage2 from "@/../public/assets/template/Temp3(2).svg";
import DealsImage3 from "@/../public/assets/template/Temp3(3).svg";
import { useRouter } from "next/navigation";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";
const deals2 = [
  { id: 1, src: DealsImage },
  { id: 2, src: DealsImage2 },
  { id: 3, src: DealsImage3 },
  { id: 4, src: DealsImage },
  { id: 5, src: DealsImage2 },
  { id: 6, src: DealsImage },
  { id: 7, src: DealsImage2 },
];
const Template3Business: React.FC = () => {
  const [locPadding, setLocPadding] = useState("");

  const [locmargin, setLocMargin] = useState("");
  useTokenRedirect();

  const dealsList = useSelector(
    (state: RootState) => state.templatesData.dealsList
  );
  const router = useRouter();
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
  const profile = dealsList?.userProfile ?? {};
  //@ts-ignore
  const reviews = dealsList?.reviews ?? {};
  //@ts-ignore
  const deals = dealsList?.deals ?? [];
  //@ts-ignore
  const average = dealsList?.average ?? 0;
  //@ts-ignore
  const count = dealsList?.count ?? 0;

  return (
    <div className={`max-sm:ps-0 ${locmargin} ${locPadding}`}>
      <div className=" min-h-svh  rounded-3xl  ">
        <div className="  container mx-auto ">
          <LogoBannerTemp3 />
        </div>
        <div className="container mx-auto">
          <div className="grid grid-cols-12 items-center py-5">
            {deals?.length > 0 ? (
              <>
                {deals.slice(0, 6).map((props: any, index: number) => (
                  <div
                    className="xl:col-span-2 lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12"
                    key={index}
                  >
                    <ButtomDiscountCard
                      mainHeading={props.discount}
                      subHeading={props.offer}
                      image={props.image}
                      title={props.title}
                      bgColor={props.bgColor}
                      dispatchData={props}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className=" col-span-12  w-full    overflow-auto flex 2xl:justify-center justify-start no-scrollbar ">
                  <div className="flex    justify-start    gap-5   pb-4   ">
                    {deals2.map((item: any, index: any) => (
                      <div className="    h-full w-60 " key={index}>
                        <Image
                          onClick={() => router.push("/business/add-deals")}
                          src={item.src}
                          className=" w-full h-full cursor-pointer object-cover"
                          height={500}
                          width={500}
                          alt="Deals"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <hr className="border-t-2 border-dotted border-black -mt-[2px] mb-2" />
          <div className="flex justify-center ">
            <div className="  md:flex block md:justify-around justify-center items-center py-10">
              <p className="text-black text-base font-bold text-start font-inter px-4 pt-2">
                Popularity
              </p>
              <h4 className="text-black text-[83px] font-normal flex justify-center  font-varela">
                {reviews?.length}
              </h4>
              <div className="flex justify-center items-center md:px-4">
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
          <hr className="border-t-2 border-dotted border-black mt-2 mb-2" />
          {/* First */}
          <div className="grid grid-cols-12 pt-10">
            <div className="lg:col-span-3 col-span-12 flex justify-center items-center">
              <h2 className="text-black text-base font-bold text-start font-inter">
                Reviews
              </h2>
            </div>
            <div className="lg:col-span-9 col-span-12">
              <Reviews data={average} count={count} />
            </div>
          </div>
          {/* Second */}
          <div className="grid grid-cols-12 py-10">
            <div className="lg:col-span-3 col-span-12 flex justify-center items-center">
              <h2 className="text-black text-base font-bold font-inter">
                Rate this Business
              </h2>
            </div>
            <div className="lg:col-span-9 col-span-12">
              <RateTheBusinessTemp data={average} count={count} />
            </div>
          </div>
          <hr className="border-t-2 border-dotted border-black -mt-[2px] mb-2" />
          <div className="grid grid-cols-12 items-center py-10">
            <div className="lg:col-span-3 col-span-12 flex justify-center items-center">
              <h2 className="text-black text-base font-bold font-inter">
                Location
              </h2>
            </div>
            <div className="lg:col-span-9 col-span-12 sm:flex items-center block justify-around sm:pt-0 pt-5">
              <div className="ps-3 sm:pb-0 pb-10">
                <h4 className="text-black text-base font-bold font-inter">
                  {profile.name}
                </h4>
                <p className="text-black text-xs font-normal font-montserrat">
                  {profile.location}
                </p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="text-sky-600 text-xs font-bold font-inter py-2">
                  Directions
                </p>
                <Image
                  src={ImageMAp}
                  height={100}
                  width={100}
                  className="bg-transparent"
                  alt="image"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template3Business;
