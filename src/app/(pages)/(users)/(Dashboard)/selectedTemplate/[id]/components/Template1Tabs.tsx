"use client"
import React, { useState } from 'react';
import Lollipop from './lollipop';
import Verticle from './discountVerticle';
import ImageIcon from "@/assets/images/getImageIcon.png";
import Reviews from '../components/reuseable/Reviews';
import RateTheBusinessTemp from '../components/reuseable/RateTheBusinessTemp';
import dealdummy from "../../../../../../../../public/assets/images/dummyImage.png"
import ImageMAp from "@/assets/images/mapImg.png";
import Image from 'next/image';
import Link from 'next/link';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5.04,
  slidesToScroll: 2,
  arrows: false,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        arrows: false,
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 624,
      settings: {
        arrows: false,
        slidesToShow: 1,
      },
    },
  ],
};
export const Poluparity = ({ data }: { data: any }) => {
  const deals = data?.data?.data?.deals
  const reviews = data?.data?.data?.reviews


  return (
    <>
      <div className='w-full'>
        <div className='flex justify-center'>
          <div className='md:flex block md:justify-around justify-center items-center py-10'>
            <p className="text-black text-xs font-light font-inter flex justify-center px-4 pt-2">This business received:</p>
            <h4 className="text-black text-[83px] font-normal flex justify-center font-varela">{reviews?.length}</h4>
            <div className='flex justify-center md:px-4'>
              <Lollipop />
              <Lollipop />
              <Lollipop />
              <Lollipop />
              <Lollipop />
            </div>
            <p className='text-black text-[15px] font-light flex justify-center font-varela'>Lollipops </p>
          </div>
        </div>
        <hr className='border-t-2 border-dotted border-black -mt-[2px] mb-2' />
        <div className="w-full flex overflow-x-auto py-5 ps-5">
          {/* <Slider {...settings}> */}
            {deals?.map((props: any, index: number) => (
              <div key={index} className="px-3 ">
                <Verticle
                  mainHeading={props?.offer}
                  subHeading={props?.discount}
                  image={props?.image ? props?.image : dealdummy }
                  title={props?.title}
                />
              </div>
            ))}
          {/* </Slider> */}
        </div>
      </div>
    </>
  )
}

export const ReviewsTab = ({ average, polularity }: any) => {

  return (
    <>
      <div>
        <div className="">
          <h3 className="text-black text-base flex font-bold font-inter justify-center items-center">
            Reviews
          </h3>
          <div className="pt-10 lg:border-r-2">
            <Reviews reviews={polularity} average={average} />
          </div>
        </div>
        <div className="pt-10">
          <h3 className="text-black text-base flex font-bold font-inter justify-center items-center">
            Rate this business
          </h3>
          <div className="py-10">
            <RateTheBusinessTemp />
          </div>
        </div>
      </div>
    </>
  )
}
export const verticleProps = [
  {
    mainHeading: 'Discount',
    subHeading: 'offer',
    image: ImageIcon,
    title: 'Add Title...',
    bgColor: '#E59261'
  },
  {
    mainHeading: 'Discount',
    subHeading: 'offer',
    image: ImageIcon,
    title: 'Add Title...',
    bgColor: '#AFCBA2'
  },
  {
    mainHeading: 'Discount',
    subHeading: 'offer',
    image: ImageIcon,
    title: 'Add Title...',
    bgColor: '#F3D146'
  },
  {
    mainHeading: 'Discount',
    subHeading: 'offer',
    image: ImageIcon,
    title: 'Add Title...',
    bgColor: '#95ABCC'
  },
  {
    mainHeading: 'Discount',
    subHeading: 'offer',
    image: ImageIcon,
    title: 'Add Title...',
    bgColor: '#E59261'
  }
];
function Tab(props: any) {
  return (
    <div
      className={`tab font-inter py-2 cursor-pointer font-medium flex justify-center items-center ${props.isActive ? 'active' : ''}`}
      onClick={() => props.onClick(props.id)}
    >
      <span>
        {props.label}
      </span>
    </div>
  );
}

function Tabse(props: any) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (id: any) => {
    setActiveTab(id);
  };

  return (
    <div className="">
      <div className='flex justify-around'>
        {props.tabs.map((tab: any, index: any) => (
          <div key={index}>
            <Tab
              key={index}
              id={index}
              label={tab.label}
              isActive={activeTab === index}
              onClick={handleTabClick}
            />
          </div>
        ))}
      </div>
      <hr className='border-t-2 border-dotted border-black -mt-[2px] mb-2' />
      <div>
        <div className="">
          {props.tabs[activeTab].content}
        </div>
      </div>
    </div>
  );
}
export default function MainFunction(data: any) {

  const location = data?.data?.data?.userProfile
  const polularity = data?.data?.data?.count
  const average = data?.data?.data?.average
  const googleMapsUrl = `https://www.google.com/maps?q=${location?.longitude},${location?.latitude}`;


  const tabs = [
    {
      label: 'Popularity',
      content: <Poluparity data={data} />
    },
    {
      label: 'Reviews',
      content: <ReviewsTab average={average} polularity={polularity} />
    },
    {
      label: 'Location',
      content: (
        <div>
          <h3 className="text-black text-base flex font-bold font-inter justify-center items-center">
            Location
          </h3>
          <div className="sm:flex block justify-around items-center py-10">
            <div className="text-start ps-3">
              <h4 className="text-black text-base font-bold font-inter">
                {location?.name}
              </h4>
              <p className="text-black text-xs font-normal font-montserrat">

                {location?.location}

                <br />
              </p>
              <p className="text-black text-xs font-normal font-montserrat max-w-96">

              </p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-sky-600 text-xs font-bold font-inter py-2">
                Directions
              </p>


              <Link target="_blank" rel="noopener noreferrer" href={googleMapsUrl} passHref>
                <Image
                  src={ImageMAp}
                  height={100}
                  width={100}
                  className="bg-transparent"
                  alt="map image"
                  unoptimized
                />
              </Link>

            </div>
          </div>
        </div>
      )
    },
  ];

  return (
    <div>
      <Tabse tabs={tabs} />
    </div>
  );
}

