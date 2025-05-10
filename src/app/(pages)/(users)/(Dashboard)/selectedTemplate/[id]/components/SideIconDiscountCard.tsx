import React from "react";
import Image from "next/image";

const SideIconDiscountCard = ({
  mainHeading,
  subHeading,
  image,

}: any) => {
  return (
    <>
      <div className="grid grid-cols-12  ">
        <div className="col-span-12 relative w-[350px]">
          <div
            className="flex justify-center items-center  "

          >
            <Image
              src={image}
              height={50}
              width={50}
              className={"bg-transparent h-60   w-full object-cover"}
              alt="image"
              unoptimized
            />
          </div>

          <div className="absolute top-2 bg-[#007042] py-2 px-5  rounded-tr-xl  rounded-br-xl flex justify-center items-center">

            <p className="text-white text-sm font-bold  font-inter">
              {subHeading ? subHeading : "No Discount"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideIconDiscountCard;
