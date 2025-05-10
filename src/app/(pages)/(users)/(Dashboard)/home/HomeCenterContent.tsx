"use client";
import React, { useState, useRef } from "react";
import Happy from "@/app/components/reuseables/Svgs/feelingToday/Happy";
import Bored from "@/app/components/reuseables/Svgs/feelingToday/Bored";
import Sad from "@/app/components/reuseables/Svgs/feelingToday/Sad";
import Anxious from "@/app/components/reuseables/Svgs/feelingToday/Anxious";
import Angry from "@/app/components/reuseables/Svgs/feelingToday/Angry";
import Stressed from "@/app/components/reuseables/Svgs/feelingToday/Stressed";
import Excited from "@/app/components/reuseables/Svgs/feelingToday/Excited";
import Pain from "@/app/components/reuseables/Svgs/feelingToday/Pain";
import Calm from "@/app/components/reuseables/Svgs/feelingToday/Calm";
import line from "../../../../../../public/assets/images/line.png";
import Image from "next/image";
import mapIcon from "../../../../../../public/assets/images/mapIcon.png";
import specialTreats from "../../../../../../public/assets/images/specialTreats.png";
import Restaurants from "@/app/components/reuseables/Svgs/outingOptions/Restaurants";
import Cafes from "@/app/components/reuseables/Svgs/outingOptions/Cafes";
import Shopping from "@/app/components/reuseables/Svgs/outingOptions/Shopping";
import Bars from "@/app/components/reuseables/Svgs/outingOptions/Bars";
import Movies from "@/app/components/reuseables/Svgs/outingOptions/Movies";
import OutdoorActivity from "@/app/components/reuseables/Svgs/outingOptions/OutdoorActivity";
import Link from "next/link";
import "../../../../globals.css";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";

interface Condition2 {
  name: string;
  color: string;
  icon: JSX.Element;
  onclick: () => void;
}

const HomeCenterContent = () => {
  const navigate = useRouter();
  const getMood = secureLocalStorage.getItem("mood");
  const conditions2: Condition2[] = [
    { name: "Restaurants", color: "bg-orange-darker", icon: <Restaurants />, onclick: () => { } },
    { name: "Cafes", color: "bg-yellow", icon: <Cafes />, onclick: () => { } },
    { name: "Shopping", color: "bg-purple", icon: <Shopping />, onclick: () => { } },
    { name: "Bars &<br />Nightclubs", color: "bg-green-dark", icon: <Bars />, onclick: () => { } },
    { name: "Movie <br />Theaters", color: "bg-[#DEA0C2]", icon: <Movies />, onclick: () => { } },
    { name: "Outdoor <br />Activities", color: "bg-cyanBlue-dark", icon: <OutdoorActivity />, onclick: () => { } },
  ];

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [text, setText] = useState("");

  const handleNavigation = (name: string) => {
    localStorage.setItem("option", name.toLowerCase().replace(' ', ''));
    navigate.push(`/outing-options?name=${encodeURIComponent(name)}`);
  };

  const emotions = [
    { name: "Happy", icon: <Happy /> },
    { name: "Sad", icon: <Sad /> },
    { name: "Angry", icon: <Angry /> },
    { name: "Excited", icon: <Excited /> },
    { name: "Bored", icon: <Bored /> },
    { name: "Anxious", icon: <Anxious /> },
    { name: "Stressed", icon: <Stressed /> },
    { name: "Pain", icon: <Pain /> },
    { name: "Calm", icon: <Calm /> },
  ];

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    secureLocalStorage.setItem("mood", emotion);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNavigation(text);
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollContainerRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 3; // Scroll speed
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  return (
    <div className="w-full">
      <div className="max-sm:mt-36 mt-10">
        <h1 className="font-montserrat font-extrabold leading-normal text-[24px] text-black">
          Today’s Mood
        </h1>
        <div className="flex pt-5 items-center">
          <div className="bg-purple rounded-xl flex-wrap w-full max-[424px]:h-[15.5rem] max-sm:h-44 max-md:h-[10rem] max-lg:h-36 lg:py-[20px] max-xl:h-30 max-2xl:h-30 h-30 sm:py-0 py-7 flex gap-[22px] justify-center items-center">
            {emotions.map((emotion, index) => (
              <div
                key={index}
                onClick={() => handleEmotionSelect(emotion.name)}
                className={`cursor-pointer ${(selectedEmotion || getMood) === emotion.name ? "bg-purple-lighter p-2 rounded-full" : ""}`}
              >
                {emotion.icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t-4 border-black border-dotted mt-5"></div>
      <div className="sm:pt-6">
        <h1 className="font-montserrat font-extrabold leading-normal text-2xl text-black">
          Outing Options
        </h1>
        <div className="bg-[#F4EEE2] mt-5 py-10 px-10">
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex justify-start gap-3 overflow-x-scroll scrollbar-custom w-[100%] show-scrollbar"
          >
            {conditions2.map((condition, index) => (
              <div
                onClick={() => handleNavigation(condition.name)}
                key={index}
                className={`${condition.color} cursor-pointer mb-5 scrollbarx sm:w-full shrink-0 !w-[129px] flex-auto min-h-48 pt-3 pb-8 px-3 rounded-lg text-center flex flex-col gap-2 ${selectedItem === condition.name ? "selected" : ""}`}
              >
                <div className="rounded-[21px] flex justify-center mt-auto">{condition.icon}</div>
                <div className="condition-name mt-auto">
                  <p
                    className="font-montserrat font-bold leading-[1.3rem] text-black text-[15px] text-center"
                    dangerouslySetInnerHTML={{ __html: condition.name }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>




        <div className="relative pt-[30px]">
          <form onSubmit={handleSubmit}>
            <input
              className="px-[10px] py-[12px] relative text-center rounded-[48px] w-full sm:w-[100%] font-roboto font-[400] leading-normal text-[17.101px] placeholder-[#000] bg-orange placeholder:text-black placeholder:opacity-[50%]"
              required
              placeholder={"Search other places..."}
              type={"text"}
              name={"searchplace"}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </form>
          <div onClick={() => handleNavigation(text)} className="absolute sm:inset-y-[34px] inset-y-[34px] right-1 w-[42px] h-[42px] flex justify-center items-center rounded-full bg-white">
            <button className="cursor-pointer">
              <Image src={mapIcon} alt="mapIcon" width={18} height={25} className="text-center" unoptimized />
            </button>
          </div>
        </div>

        <Link href={"/special-treats"}>
          <Image src={specialTreats} alt="mapIcon" className="cursor-pointer text-center pt-[29px] rounded-[10px]" unoptimized />
        </Link>

        <Image src={line} alt="line" height={0} className="pt-8 text-center" unoptimized />
      </div>
    </div>
  );
};

export default HomeCenterContent;
