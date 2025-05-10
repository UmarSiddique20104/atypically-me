import React from "react";
import Image from "next/image";

const HorizontalDiscountCard = ({ mainHeading, subHeading, image }: any) => {

  return (
    <>
      <div className="grid grid-cols-12 ">
        <div className="col-span-4">
          <div className="flex justify-center items-center   ">
            <Image
              src={image}
              height={500}
              width={500}
              className={
                "bg-transparent object-cover object-right-top h-52 w-full"
              }
              alt="image"
              unoptimized
            />
          </div>
        </div>
        <div className="col-span-8 bg-[#007042] flex justify-center items-center">
          <div>
            <h4 className="text-white sm:text-2xl text-xl font-bold  font-inter">
              {mainHeading && mainHeading}

            </h4>
            <p className="items-start text-white text-[15px] font-medium  font-inter">
              {subHeading ? subHeading : "No Discount"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HorizontalDiscountCard;
