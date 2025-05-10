import Image from "next/image";
import React  from "react";

const LogoImageTemp03 = ({ image, title }: any) => {
  return (
    <>
      <div className="flex justify-center items-center pt-5 sm:pb-5 pb-1 w-full">
        <div className="flex justify-center items-center relative ">
          <div className="    flex-col justify-center items-center ">
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
      </div>
      <div className="flex justify-center items-center w-full">
        <h2 className="text-black text-xl font-medium font-inter bg-transparent">
          {title}
        </h2>
      </div>
    </>
  );
};

export default LogoImageTemp03;
