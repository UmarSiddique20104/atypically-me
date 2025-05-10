import Image from "next/image";
import React from "react";
import LogoImageTemp03 from "./LogoImageTemp-03";
import DummyImage from "../../../../../../../../public/assets/images/bussinesstarbucks.png";
import dummyImg from "@/assets/images/temp1logo.png"
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

const LogoBannerTemp3 = (data: any) => {
  const mainBannerImage = useSelector((state: RootState) => state.image.mainBannerImage);
  return (
    <>
      <div>
        <div className=" bg-primary relative   h-80">

          <div className="relative flex justify-center  !h-[245px] !w-full mb-[23.57px] object-cover  ">
            <div className="   w-full  ">

              <Image
                src={mainBannerImage ? mainBannerImage : DummyImage}
                height={500}
                width={500}
                className={" bg-transparent w-full object-fill  h-60"}
                alt="image"
                unoptimized
              />

            </div>

          </div>
          <div className="absolute bottom-0   left-1/2 transform -translate-x-1/2   ">
            <div className="">
              <LogoImageTemp03 image={data?.data?.data?.userProfile?.image ? data?.data?.data?.userProfile?.image : dummyImg} title={data?.data?.data?.userProfile?.name} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoBannerTemp3;