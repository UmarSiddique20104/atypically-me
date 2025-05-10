import Image from "next/image";
import React from "react";
import ImageIcon from "@/assets/images/getImageIcon.png";
import BusinessLogo from "./businessLogo";
const LogoWithBanner = () => {
  return (
    <>
      <div>
        <div className=" bg-primary relative   h-80">
          <div className=" flex justify-center items-center w-full   bg-[#C5B5D3]">
            <div className="   w-full  ">
              <div className="flex flex-col justify-center items-center h-60 ">
                <p className="text-white text-xl font-medium  font-inter">
                  + Upload upto 4 Banners
                </p>
                <p className="text-neutral-600 text-[15px] font-medium  font-inter">
                  1320 x 240 Pixels
                </p>
              </div>
            </div>
            <div className="absolute  w-full">
              <input
                type="file"
                className="h-60  w-full bg-transparent cursor-pointer  text-transparent"
              />
            </div>
          </div>
          <div className="absolute bottom-0   left-1/2 transform -translate-x-1/2   ">
            <div className="">
              <BusinessLogo />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoWithBanner;
