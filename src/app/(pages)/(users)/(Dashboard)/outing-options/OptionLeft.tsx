"use client";
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Image from "next/image";
import "../../../../globals.css";
import CustomLollipop from "@/app/(pages)/business/components/reuseable/Customlolipop";
import CustomInActivelolipop from "@/app/(pages)/business/components/reuseable/CustomInActivelolipop";

import Button from "@/app/components/reuseables/Svgs/Button";
import { User } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";

interface OptionLeftProps {
  users: User[];
  relevenceUsers: User[];
  selectUser: (user: User) => void;
}

const OptionLeft: React.FC<OptionLeftProps> = ({ users, relevenceUsers, selectUser }) => {
 
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const router = useRouter();

  const handleClicked = (user: User, index: number) => {
    selectUser(user);
    setActiveIndex(index);
  };
  const searchParams = useSearchParams();
  const OutingName = searchParams.get('name');

  const handleClick = (id:any) => {
     

    router.push(`/ask-a-question?name=${OutingName}`);

  
    localStorage.setItem("businessId",id )

  };
  // const roundedRating = Math.round(user?.rating);

  return (
    <div className="bg-[#F5F5F5] static -z-50 ">
      <div className=" bg-[#F5F5F5]  rounded-xl">
        <Tabs className="outingTabs ">
          <TabList className="flex flex-wrap max-sm:flex-col py-3 justify-center max-sm:gap-2 md:gap-10 gap-8 items-center">
            <Tab className="font-montserrat font-bold text-black px-[50px] py-[5.67px] border border-black !rounded-full cursor-pointer">
              Relevance
            </Tab>
            <Tab className="font-montserrat font-bold text-black px-[50px] py-[5.67px] border border-black !rounded-full cursor-pointer">
              Distance
            </Tab>
          </TabList>

          <TabPanel className="">
            <div
              className="topic-list bg-[#F5F5F5] lg:px-8  py-[15px] rounded-lg"
              style={{ maxHeight: "660px", overflowY: "scroll" }}
            >
              {relevenceUsers?.map((user: User, index) => (
                <div
                  onClick={() => handleClicked(user, index)}
                  key={user.id}
                  className={`flex my-[12.79px]  justify-between items-center cursor-pointer bg-[#F4EEE2] pt-[13.95px] pb-[15.11px] max-sm:px-[7.11px] px-[15.11px] rounded-[11.624px] ${activeIndex === index
                    ? "border-[1.162px] border-solid border-black pb-4 "
                    : ""
                    }`}
                >
                  <div className="topic-item w-fit flex items-center gap-3">
                    <div className="sm:w-[200px] max-[430px]:w-[140px] h-[122px] overflow-hidden rounded-[10px]">
                      {user.image &&
                        <Image
                          src={user.image}
                          alt="topicImage"
                          width="200"
                          height="122"
                          className="cursor-pointer object-fill h-full w-[200px]"
                          unoptimized
                        />
                      }
                    </div>

                    <div className="flex flex-col gap-[7.76px] w-full">
                      <div className="font-montserrat text-[15px] font-semibold leading-normal text-black text-xs text-wrap pe-1 max-sm:w-[70%]">
                        <p>{user.name}</p>
                      </div>
                      <div className="flex items-center justify-start gap-3">
                        <div className="font-montserrat text-[10px] font-normal leading-normal text-black text-xs">
                          {user?.rating?.toFixed(1)}
                        </div>
                        <div className="flex h-[11px]">
                          {[...Array(5)].map((_, index) => {
                            return index < user?.rating ? (
                              <CustomLollipop key={index} width={12} height={11} />
                            ) : (
                              <CustomInActivelolipop key={index} width={12} height={11} />
                            );
                          })}
                        </div>
                        <div className="font-montserrat text-[10px] font-normal leading-normal text-black text-xs">
                          ({user?.totalRatings})
                        </div>
                      </div>

                      <div className="font-montserrat text-[10px] font-normal leading-normal text-black text-xs">
                        {user?.type} -{user?.distance?.toFixed(2)} mi

                      </div>
                      <div className="font-montserrat text-[10px] font-normal leading-normal text-black text-xs flex">
                        <p className={`text-[${user.open ? "#42f569" : "#FF0505"}] font-semibold pe-[3px]`}>
                          {user?.open ? "Open" : "Closed"}{" "}
                        </p>
                        {user?.open ? "Closes" : "Opens"}{" "}
                        {moment(user?.open ? user?.closingTime : user?.openingTime).format("h:mm a")}
                      </div>
                      <div className="flex flex-wrap max-sm:w-[100%]  items-center ">
                        <button onClick={() => router.push(`/discussion-board?name=${OutingName}`)} className="w-[102.291px] max-sm:w-[80%] h-[18.598px] max-sm:my-2  bg-black text-[8px] font-bold font-montserrat text-white rounded-[11.624px] me-[3px]">
                          Discussion board
                        </button>

                        <button
                          onClick={() => handleClick(user?.id)}
                          className="w-[102.291px] max-sm:w-[80%] h-[18.598px]  bg-black text-[8px] font-bold font-montserrat text-white rounded-[11.624px]"
                        >
                          Ask a Question
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>

          <TabPanel className="">
            <div
              className="topic-list bg-[#F5F5F5] lg:px-8 py-[15px]  rounded-lg"
              style={{ maxHeight: "660px", overflowY: "scroll" }}
            >
              {users.map((user: User, index) => (
                <div
                  onClick={() => handleClicked(user, index)}
                  key={user.id}
                  className={`flex my-[12.79px] justify-between items-center cursor-pointer bg-[#F4EEE2] pt-[13.95px] pb-[15.11px] max-sm:px-[7.11px]  px-[15.11px]  rounded-[11.624px]  ${activeIndex === index
                    ? "border-[1.162px] border-solid border-black pb-4 "
                    : ""
                    }`}
                >
                  <div className="topic-item flex  w-fit items-center gap-3">
                    <div className="relative sm:w-[200px] max-[430px]:w-[140px] h-[122px] overflow-hidden rounded-[10px]">
                      {user.image &&
                        <Image
                          src={user.image}
                          alt="topicImage"
                          layout="fill"
                          objectFit="cover"
                          className="cursor-pointer object-fill h-full w-[200px]"
                          unoptimized
                        />
                      }
                    </div>
                    <div className="flex flex-col gap-[7.76px] w-full">
                      <div className="font-montserrat text-[15px] font-semibold leading-normal text-black text-xs">
                        {user.name}
                      </div>
                      <div className="flex items-center justify-start gap-3">
                        <div className="font-montserrat text-[10px] font-normal leading-normal text-black text-xs">
                          {user?.rating?.toFixed(1)}
                        </div>
                        <div className="flex h-[11px]">
                          {[...Array(5)].map((_, index) => {
                            return index < user?.rating ? (
                              <CustomLollipop key={index} width={12} height={11} />
                            ) : (
                              <CustomInActivelolipop key={index} width={12} height={11} />
                            );
                          })}
                        </div>
                        <div className="font-montserrat text-[10px] font-normal leading-normal text-black text-xs">
                          ({user?.totalRatings})
                        </div>
                      </div>

                      <div className="font-montserrat text-[10px] font-normal leading-normal text-black text-xs">
                        {user?.type} -{user?.distance?.toFixed(2)} mi

                      </div>
                      <div className="font-montserrat text-[10px] font-normal leading-normal text-black text-xs flex">
                        <p className={`text-[${user.open ? "#42f569" : "#FF0505"}] font-semibold pe-[3px]`}>
                          {user?.open ? "Open" : "Closed"}{" "}
                        </p>
                        {user?.open ? "Closes" : "Opens"}{" "}
                        {moment(user?.open ? user?.closingTime : user?.openingTime).format("h:mm a")}
                      </div>
                      <div className="flex flex-wrap max-sm:w-{100%}  items-center ">
                        <button onClick={() => router.push(`/discussion-board?name=${OutingName}`)} className="w-[102.291px] max-sm:w-[80%] h-[18.598px] max-sm:my-2  bg-black text-[8px] font-bold font-montserrat text-white rounded-[11.624px] me-[3px]">
                          Discussion board
                        </button>

                        <button
                          onClick={() =>handleClick(user?.id)}
                          className="w-[102.291px] max-sm:w-[100%] h-[18.598px]  bg-black text-[8px] font-bold font-montserrat text-white rounded-[11.624px]"
                        >
                          Ask a Question
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default OptionLeft;