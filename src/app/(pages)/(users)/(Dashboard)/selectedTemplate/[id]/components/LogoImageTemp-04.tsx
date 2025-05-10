import Image from "next/image";
import React from "react";

const LogoImageTemp4 = ({ image, title }: any) => {
  return (
    <>
      <div className="flex justify-center items-center py-5 w-full">
        <div className="flex justify-center items-center relative pt-10">
          <Image
            src={image}
            height={500}
            width={500}
            className={"rounded-full h-40 w-40 object-cover"}
            alt="image"
            unoptimized
          />
        </div>
      </div>
      <div className="flex justify-center items-center w-full px-2">
        <h2 className="text-black text-xl  font-medium font-inter bg-transparent  ">
          {" "}
          {title}
        </h2>
      </div>
    </>
  );
};

export default LogoImageTemp4;
