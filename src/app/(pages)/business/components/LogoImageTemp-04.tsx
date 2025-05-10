"use client"
import { RootState } from "@/app/redux/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const LogoImageTemp4 = () => {
  const [state, setState] = useState<string>('')
  const dealsList = useSelector((state: RootState) => state.templatesData.dealsList);
  //@ts-ignore
  const userProfile = dealsList?.userProfile;
  const router = useRouter();
  return (
    <>
      <div className="flex justify-center items-center py-5 w-full">
        <div className="flex justify-center items-center relative">

          {userProfile?.image ?
            <div className="flex-col justify-center items-center ">
              <Image
               onClick={()=>router.push("/business/edit-profile")}
                height={120}
                width={120}
                src={userProfile?.image}
                className="w-[120px] !h-[120px]  object-cover rounded-full cursor-pointer"
                alt=".."
                unoptimized
              />
            </div>
            :
            <div className="w-[110px] h-[110px] bg-black rounded-full flex-col justify-center items-center cursor-pointer"  onClick={()=>router.push("/business/edit-profile")}>
              <p className="text-center text-white text-[22.33px] font-medium font-inter pt-7">
                +
              </p>
              <p className="text-center text-white text-[11px] font-medium  font-inter">
                Business Logo
              </p>
              <p className="text-center text-[#8E8C8C] text-[8px] font-medium  font-inter">
                110x110
              </p>
            </div>
          }


        </div>
      </div>
      <div className="flex justify-center items-center w-full px-2">
        <h2 className="text-black text-xl  font-medium font-inter bg-transparent  ">
          {userProfile?.name}
        </h2>

      </div>
    </>
  )
}

export default LogoImageTemp4