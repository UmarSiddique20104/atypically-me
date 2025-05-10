
"use client"
import React, { useState } from "react";
import "../../../globals.css"
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
const BusinessLogo = () => {
  const [state, setState] = useState<string>('')
  const dealsList = useSelector((state: RootState) => state.templatesData.dealsList);
  
  //@ts-ignore
  const userProfile = dealsList?.userProfile;
  const router = useRouter();
  return (
    <>
      <div className="flex justify-center items-center py-5 w-full">
        <div className="flex justify-center items-center relative">
          <div>
            {userProfile?.image ?
              <div className="!h-[76px]">
                <Image
                onClick={()=>router.push("/business/edit-profile")}
                  height={76}
                  width={76}
                  src={userProfile?.image}
                  className="!h-[76px] object-cover rounded-full cursor-pointer"
                  alt=".."
                  unoptimized
                />
              </div>
              :
              <div className="w-[125px] cursor-pointer h-[125px] bg-black rounded-full flex-col justify-center items-center "               onClick={()=>router.push("/business/edit-profile")}>
                <p className="text-center text-white text-[22.33px] font-medium font-inter pt-8">
                  +
                </p>
                <p className="text-center text-white text-[15px] font-medium  font-inter">
                  Business Logo
                </p>
                <p className="text-center text-[#8E8C8C] text-[10px] font-medium  font-inter">
                  125x125
                </p>
              </div>
            }


          </div>

        </div>
      </div>
      <div className="flex justify-center items-center px-2">
        <h2 className="text-black text-xl  font-medium font-inter bg-transparent">
          {userProfile?.name}
        </h2>
      </div>
    </>
  );
};

export default BusinessLogo;
