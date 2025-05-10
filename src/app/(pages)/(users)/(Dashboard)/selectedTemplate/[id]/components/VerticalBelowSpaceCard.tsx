import React from "react";
import Image from "next/image";

const VerticalBelowSpaceCard = ({ mainHeading, subHeading, image }: any) => {
  return (
    <>
      <div className=" ">
        <div className="flex justify-center items-center ">
          <Image
            src={image}
            height={50}
            width={50}
            className={"bg-transparent h-52 w-full object-fill"}
            alt="image"
            unoptimized
          />
        </div>
      </div>
      <div className=" mt-3 bg-[#007042] flex flex-col py-2 justify-center items-center  rounded-lg">
        <h4 className="text-white text-lg font-bold  font-inter">
          {mainHeading}
        </h4>
        <p className="items-start text-white xl:text-xs text-[8px] font-medium  font-inter">
          {subHeading ? subHeading : "No Discount"}
        </p>
      </div>
    </>
  );
};

export default VerticalBelowSpaceCard;