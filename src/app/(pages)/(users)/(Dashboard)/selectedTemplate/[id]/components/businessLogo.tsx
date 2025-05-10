 
 
import React, { useState } from "react";
import "@/app/globals.css"
import Image from "next/image";
  const BusinessLogo = ({image ,title}:any) => {
  return (
    <>
      <div className="flex justify-center items-center py-5 w-full">
        <div className="flex justify-center items-center relative">
             <Image
            src={image}
            height={1000}
            width={1000}
            className={'rounded-full h-24 w-24 object-fill'}
            alt='image'
            unoptimized
            />
         
         
        </div>
      </div>
      <div className="flex justify-center items-center px-2">
        <h2 className="text-black text-xl  font-medium font-inter bg-transparent">
       {title}
        </h2>
        
      </div>
    </>
  );
};

export default BusinessLogo;
