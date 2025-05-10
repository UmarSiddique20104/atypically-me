'use client'
import React, { useState } from 'react';
import CustomHeadingV2 from '@/app/components/reuseables/CustomHeadingV2';
import Button from '@/app/components/reuseables/Svgs/Button';
import Happy from '@/app/components/reuseables/Svgs/feelingToday/Happy';
import Bored from '@/app/components/reuseables/Svgs/feelingToday/Bored';
import Sad from '@/app/components/reuseables/Svgs/feelingToday/Sad';
import Anxious from '@/app/components/reuseables/Svgs/feelingToday/Anxious';
import Angry from '@/app/components/reuseables/Svgs/feelingToday/Angry';
import Stressed from '@/app/components/reuseables/Svgs/feelingToday/Stressed';
import Excited from '@/app/components/reuseables/Svgs/feelingToday/Excited';
import Pain from '@/app/components/reuseables/Svgs/feelingToday/Pain';
import Calm from '@/app/components/reuseables/Svgs/feelingToday/Calm';
import "../../../globals.css"
import secureLocalStorage from "react-secure-storage";
import { useRouter } from 'next/navigation';
import { showMessage } from '@/app/components/reuseables/Notification';
interface Condition {
  name: string;
  color: string;
  icon: JSX.Element;
}

const FeelingToday = () => {
  const conditions: Condition[] = [
    {
      name: "Happy",
      color: 'bg-purple',
      icon: <Happy />
    },
    {
      name: "Bored",
      color: 'bg-orange-dark',
      icon: <Bored />
    },
    {
      name: "Sad",
      color: 'bg-yellow',
      icon: <Sad />
    },
    {
      name: "Anxious",
      color: 'bg-purple-light',
      icon: <Anxious />
    },
    {
      name: "Angry",
      color: 'bg-green',
      icon: <Angry />
    },
    {
      name: "Stressed",
      color: 'bg-yellow',
      icon: <Stressed />
    },
    {
      name: "Excited",
      color: 'bg-cyanBlue-dark',
      icon: <Excited />
    },
    {
      name: "Pain",
      color: 'bg-[#B5C9A5]',
      icon: <Pain />
    },
    {
      name: "Calm",
      color: 'bg-orange-mediumDark',
      icon: <Calm />
    },
  ];
  const [selectedItems, setSelectedItems] = useState<string>("");

  const toggleSelection = (itemName: string) => {

    setSelectedItems(itemName);
    secureLocalStorage.setItem("mood", itemName);
  };
  const router = useRouter()
  const continueSelection = () => {
    if (selectedItems != "") {

      router.push("/make-a-better-day")
    } else {
      showMessage("Please select a mood", "error")
    }
  };
  return (
    <div className='bg-primary min-h-svh flex py-[30px] flex-col justify-center items-center sm:px-0 px-5 relative'>
      <div>
        <div>
          <CustomHeadingV2 lineBreak={true} title="How are you" emphasizedText="feeling" restOfText="" restOfText2={'today?'} />
        </div>
        <div className="grid-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 md:py-[50px]  py-[25px]">
          {conditions.map((condition, index) => (
            <div
              key={index}
              className={`p-2 cursor-pointer  `}
              onClick={() => toggleSelection(condition.name)}
            >

              <div className={`${condition.color} rounded-[20px] w-[329px] h-[78px] flex justify-center items-center ${selectedItems.includes(condition.name) ? 'border-2 border-black' : ''}`}>
                <div className='flex justify-between items-center w-full px-5'>
                  <div >
                    {condition.icon}
                  </div>
                  <div className="condition-name flex items-center   text-center pe-5">
                    <p className="font-montserrat font-[700] h-full flex items-center text-black text-[20px] text-center" dangerouslySetInnerHTML={{ __html: condition.name }} />
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='text-center'>
          <div >
            <span onClick={continueSelection}>

              <Button>
                Continue
              </Button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeelingToday;
