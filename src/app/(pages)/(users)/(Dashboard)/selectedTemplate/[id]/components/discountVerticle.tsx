import Image from "next/image";
import React from "react";
const Verticle = ({ mainHeading, subHeading, image, title }: any) => {
  return (
    <>
      <div className=" lg:w-[280px]  w-[300px]  max-[420px]:w-[300px] ">
        <div className={`w-full     rounded-xl`}>
          <div className="w-full  py-4 bg-[#007042] rounded-tl-xl rounded-tr-xl flex flex-col justify-center items-center">
            <h3 className="text-white text-xl font-bold  font-inter">
              {mainHeading && mainHeading}
            </h3>
            <h4 className="text-white text-xs  font-normal  font-inter">
              {subHeading ? subHeading : "No Discount"}

            </h4>
          </div>

          <div className="flex justify-center items-center  ">
            <Image
              src={image}
              height={200}
              width={500}
              className={
                "bg-transparent h-72 object-cover object-top w-full   "
              }
              alt="image"
              unoptimized
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-center items-center">
            <p className="text-black text-xs font-bold font-inter py-5">
              {title}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verticle;
