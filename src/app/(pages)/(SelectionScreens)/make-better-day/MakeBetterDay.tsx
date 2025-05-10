'use client'
import React, { useEffect, useState } from 'react';
import BirdsIcon from '@/app/components/reuseables/Svgs/BirdsIcon';
import MailIcon from '@/app/components/reuseables/Svgs/MailIcon';
import Button from '@/app/components/reuseables/Svgs/Button';
import Link from 'next/link';
import BetterDayIcon from '@/app/components/reuseables/Svgs/BetterDayIcon';
import "../../../globals.css"

const MakeBetterDay = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='bg-green min-h-svh flex flex-col justify-center items-center relative'>
      <div>
        <div className='flex px-12 justify-center'>
          <BetterDayIcon />
        </div>
        <div className={' text-center py-[30px]'}>
          <p className='font-montserrat font-[400] sm:text-[25px] text-[20px]  text-black'>We all feel that way sometimes...</p>
          <h1 className='font-montserrat font-[700] leading-[1.3] sm:text-[45px] text-[35px] text-black'>Let’s see<br />if we can make it a<br />better day!
          </h1>
        </div>
        <Link href={'/home'} className='pt-8 flex justify-center'>
          <Button>
            Skip
          </Button>
        </Link>
      </div>

    </div >
  );
};

export default MakeBetterDay;
