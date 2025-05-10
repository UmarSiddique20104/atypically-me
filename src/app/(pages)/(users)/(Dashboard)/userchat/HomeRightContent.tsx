"use client";
import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import topicImage from "../../../../../../public/assets/images/topicImage.png";
import Image from "next/image";
import "../../../../globals.css";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import getAndDecryptCookie from "@/app/lib/auth";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";

const HomeRightContent = () => {
  const [topics, setTopic] = useState<any[]>([]);
  const [challenges, setChallenge] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getChallenges = async (token: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.GET_USERCHALLENGES, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        setIsLoading(false);
        throw new Error(`Failed to fetch challenges: ${res.statusText}`);
      }
      const result = await res.json();
      setChallenge(result?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching challenges:", error);
    }
  };

  const getTopics = async (token: any) => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_USERTOPICS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch topics: ${res.statusText}`);
      }
      const result = await res.json();
      setTopic(result?.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  useEffect(() => {
    const token = getAndDecryptCookie("AccessToken");
    getTopics(token);
    getChallenges(token);
  }, []);

  return (
    <div className=" h-full">
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <h1 className="font-montserrat pb-5 text-center font-extrabold leading-normal text-[24px] text-black">
        Top Discussions
      </h1>
      <div className=" bg-[#D2E4C4] lg:h-[90vh]   pt-10 w-full  overflow-hidden  rounded-xl">
        <Tabs className="MoodTabs">
          <TabList className="flex flex-wrap justify-center md:gap-4  gap-6 items-center">
            <Tab className="font-montserrat font-bold text-white cursor-pointer bg-[#B5C9A5] py-[5.66px] rounded-[14.545px] px-10 lg:px-[58px] xl:px-10">
              Topics
            </Tab>
            <Tab className="font-montserrat font-bold text-white cursor-pointer  bg-[#B5C9A5] py-[5.66px] rounded-[14.545px] px-10">
              Challenges
            </Tab>
          </TabList>

          <TabPanel className="py-3 ">
            <div className="p-7 ">
              <div
                className="topic-list bg-primary p-5 rounded-lg"
                style={{ maxHeight: "660px", overflowY: "auto" }}
              >
                {topics?.map((topic, index) => (
                  <div
                    className={`flex mb-6  justify-between items-center ${
                      index !== topics?.length - 1
                        ? "border-b border-gray-300 pb-4"
                        : ""
                    }`}
                    key={topic?.attributes?.id}
                  >
                    <div className="topic-item flex items-center gap-2">
                      <img
                        src={topic?.attributes?.image}
                        alt=""
                        className="cursor-pointer text-center rounded-[10px] h-10 w-10"
                      />
                      {/* <Image
                                            width={40}
                                            height={40}
                                            src={topic?.attributes?.image}
                                            alt="topicImage"
                                            className="cursor-pointer text-center rounded-[10px] h-10 w-10"
                                            unoptimized
                                        /> */}
                      <div className="font-montserrat font-medium leading-[1.3rem] text-black text-xs">
                        {topic?.attributes?.name}
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="8"
                      viewBox="0 0 6 8"
                      fill="none"
                    >
                      <path
                        d="M5.79526 4.42263L1.8456 7.82369C1.5726 8.05877 1.13117 8.05877 0.861084 7.82369L0.204743 7.25852C-0.0682478 7.02344 -0.0682478 6.64333 0.204743 6.41075L3.00436 4L0.204744 1.58925C-0.0682477 1.35417 -0.0682477 0.974054 0.204744 0.741481L0.861084 0.176305C1.13408 -0.0587683 1.57551 -0.0587683 1.8456 0.176305L5.79526 3.57737C6.06825 3.80744 6.06825 4.18756 5.79526 4.42263Z"
                        fill="black"
                        fillOpacity="0.22"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="p-7 py-1 pb-4 overflow-y-scroll lg:h-[80vh] no-scrollbar ">
              <div
                className="challenge-list bg-white py-7 p-7 rounded-lg"
                style={{ maxHeight: "660px", overflowY: "auto" }}
              >
                {challenges?.map((challenge, index) => (
                  <div
                    className={`flex p-5 font-[500] rounded-xl mb-3 text-center justify-center items-center  ${
                      index !== challenges?.length - 1
                        ? "border-b border-gray- pb-4"
                        : ""
                    }`}
                    key={challenge?.id}
                    style={{ background: challenge?.attributes?.color }}
                  >
                    {challenge?.attributes?.name}
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default HomeRightContent;
