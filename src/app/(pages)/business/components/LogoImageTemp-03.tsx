"use client"
import { RootState } from "@/app/redux/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const LogoImageTemp03 = () => {
  const [state, setState] = useState<string>('')
  const dealsList = useSelector((state: RootState) => state.templatesData.dealsList);
  //@ts-ignore
  const userProfile = dealsList?.userProfile;
  const router = useRouter();
  return (
    <>
      <div className="flex justify-center items-center pt-5 sm:pb-5 pb-1 w-full">
        <div className="flex justify-center items-center relative ">
          <div >
            {userProfile?.image ?
              <div>
                <div className="h-[76px] w-[76px]">
                  <Image
                  onClick={()=>router.push("/business/edit-profile")}
                    height={76}
                    width={76}
                    src={userProfile?.image}
                    className="!h-[76px] !w-[76px] object-cover rounded-full cursor-pointer"
                    alt=".."
                    unoptimized
                  />
                </div>
              </div>
              :
              <div className="w-[125px] h-[125px] bg-black rounded-full flex-col justify-center items-center cursor-pointer "  onClick={()=>router.push("/business/edit-profile")}>
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
      <div className="flex justify-center items-center w-full">
        <h2 className="text-black text-xl font-medium font-inter bg-transparent">
          {userProfile?.name}
        </h2>
      </div>
    </>
  );
};

export default LogoImageTemp03;
