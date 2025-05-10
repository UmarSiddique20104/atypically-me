'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainHeader from '@/app/components/sidebar/MainHeader/MainHeader';
import "../../../../globals.css"
import { createHeaders, createRequestOptions, fetchApi } from '@/app/components/utils/Helper';
import { showMessage } from '@/app/components/reuseables/Notification';
import getAndDecryptCookie from '@/app/lib/auth';
import API_ENDPOINTS from '@/app/components/ApiRoutes/apiRoutes';
import { Loader } from '@/app/components/reuseables/Svgs/Loader';

const About = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();

  const token = getAndDecryptCookie("AccessToken");
  useEffect(() => {
    const AboutUs = async () => {
      setIsLoading(true);
      const headers = createHeaders(token ?? "");
      const requestOptions = createRequestOptions("GET", headers);
      const url = `${API_ENDPOINTS.ABOUT}`;
      try {
        const result = await fetchApi(url, requestOptions);
        if (result?.data) {
          setData(result?.data?.attributes?.details);
          setIsLoading(false);
        } else {
          showMessage(result?.message, "error");
          console.error("API Response Error:", result);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("GetDeals error:", error);
        setIsLoading(false);
      }
    };
    AboutUs();
  }, []);
  return (
    <>
      {isLoading && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="flex min-h-screen bg-primary">
        <div className='flex flex-col w-full'>
          <MainHeader
            title='About'
            subtitle=''
            goto='/home'
            bg="purple"
            font='24px'
            paddding={true}
          />
          <div className='ml-28 md:ml-ml-28  max-sm:ml-[1.3rem] md:pr-[4rem]  pr-4  mt-5'>
            <h1 className="font-montserrat cursor-pointer font-extrabold leading-normal max-lg:px-2 px-16 text-2xl mb-5">Atypically me</h1>
            <div className="border-t-4 border-black border-dotted mt-5me-[23px] pt-5 "></div>
            <div className='pt-5 max-lg:px-2 px-16'>
              <p
                className="font-montserrat font-normal leading-[30px] text-[15px] capitalize text-justify"
                style={{ wordSpacing: "1px" }}
                dangerouslySetInnerHTML={{ __html: data }}
              >
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default About;
