import Image from "next/image";
import React from "react";
const DealsCard = ({ mainHeading, subHeading, image, title, bgColor }: any) => {
  return (
    <>
      <div className="flex items-center gap-[26px]">
        <div className={`rounded-[9px]`} style={{ background: bgColor }}>
          <div className="py-1 bg-[#007042] rounded-tl-xl text-center rounded-tr-xl flex flex-col justify-center items-center w-[146px]">
            <h3 className="font-montserrat text-[13px] text-white font-bold leading-normal">
              {mainHeading ? mainHeading : "No Discount"}

            </h3>
            <h4 className="text-white text-xs font-normal font-inter">
              {subHeading}
            </h4>
          </div>
          <div className="w-[146px]">
            <Image
              src={image}
              height={512}
              width={146}
              className={"!h-[100px] bg-transparent rounded-b-[9px]"}
              alt="image"
              unoptimized
            />
          </div>
        </div>
        <div className="">
          <p className="text-black text-xs font-bold font-inter py-5">{title}</p>
        </div>
      </div>

    </>
  );
};

export default DealsCard;
