'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import MainHeader from '@/app/components/sidebar/MainHeader/MainHeader';
import Button from '@/app/components/reuseables/Svgs/Button';
import '../../../../globals.css'
import getAndDecryptCookie from '@/app/lib/auth';
import { createHeaders, createRequestOptions, fetchApi } from '@/app/components/utils/Helper';
import API_ENDPOINTS from '@/app/components/ApiRoutes/apiRoutes';
import { showMessage } from '@/app/components/reuseables/Notification';
import { Loader } from '@/app/components/reuseables/Svgs/Loader';
import { useRouter } from 'next/navigation';

const TermsAndConditions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const token = getAndDecryptCookie("AccessToken");
  const [data, setData] = useState<any>();
  useEffect(() => {
    const getPrivacyPolicy = async () => {
      setIsLoading(true);
      const headers = createHeaders(token ?? "");
      const requestOptions = createRequestOptions("GET", headers);
      const url = `${API_ENDPOINTS.GET_TERMSCONDITION}`;
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
    getPrivacyPolicy();
  }, []);
  const navigate = useRouter()
  const handleRoute = () => {
    navigate.push('/support')
  }
  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="flex min-h-screen  bg-primary">
        <div className='flex flex-col w-full'>
          <MainHeader
            title='Term & Conditions'
            subtitle=''
            goto='/home'
            bg="orange-darker"
            font='24px'
            paddding={true}
          />
          <div className='ml-28 md:ml-ml-28 max-sm:ml-[1.3rem]  pr-4 mt-5'>
            <div className="pt-8 max-lg:px-2 px-16">
              <p
                className="font-montserrat font-normal leading-[30px] text-[15px] capitalize text-justify"
                style={{ wordSpacing: "1px" }}
                dangerouslySetInnerHTML={{ __html: data }}
              >
              </p>
            </div>

            <div className='pt-20 text-center py-4'>
              <div onClick={() => handleRoute()}>
                <Button className='text-xl px-[55px] py-[9px]'>
                  Support
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default TermsAndConditions;
