import Image from "next/image";
import React from "react";
import ImageIcon from "@/assets/images/getImageIcon.png";
import BusinessLogo from "./businessLogo";
import LogoImageTemp4 from "./LogoImageTemp-04";

import DummyImage from "../../../../../../../../public/assets/images/bussinesstarbucks.png";
import dummyImg from "@/assets/images/temp1logo.png";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
const SixImagesBanner = (data: any) => {
  const mainBannerImage = useSelector(
    (state: RootState) => state.image.mainBannerImage
  );

  return (
    <>
      <div>
        <div className=" bg-primary relative  ">
          <div className=" flex justify-center items-center w-full   bg-[#95ABCC]">
            <div className="   w-full  ">
              <div className="flex flex-col w-full justify-center items-center h-[180px] ">
                <div className="relative w-full">
                  <div className="   w-full  ">
                    <Image
                      src={mainBannerImage ? mainBannerImage : DummyImage}
                      height={500}
                      width={500}
                      className={
                        " bg-transparent !h-[250px] !w-full mb-[23.57px] object-fill "
                      }
                      alt="image"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="   ">
            <LogoImageTemp4
              image={
                data?.data?.data?.userProfile?.image
                  ? data?.data?.data?.userProfile?.image
                  : dummyImg
              }
              title={data?.data?.data?.userProfile?.name}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SixImagesBanner;
