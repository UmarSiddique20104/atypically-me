'use client'
import React, { useEffect, useState } from 'react';
import MainHeader from '@/app/components/sidebar/MainHeader/MainHeader';
import '../../../../globals.css'
import getAndDecryptCookie from '@/app/lib/auth';
import { createHeaders, createRequestOptions, fetchApi } from '@/app/components/utils/Helper';
import API_ENDPOINTS from '@/app/components/ApiRoutes/apiRoutes';
import { showMessage } from '@/app/components/reuseables/Notification';
import { Loader } from '@/app/components/reuseables/Svgs/Loader';
const Faqs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const token = getAndDecryptCookie("AccessToken");
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    const getPrivacyPolicy = async () => {
      setIsLoading(true);
      const headers = createHeaders(token ?? "");
      const requestOptions = createRequestOptions("GET", headers);
      const url = `${API_ENDPOINTS.FAQS}`;
      try {
        const result = await fetchApi(url, requestOptions);
        if (result?.data) {
          setData(result?.data);
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
  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="flex min-h-screen bg-primary">
        <div className='flex flex-col w-full'>
          <MainHeader
            title='FAQ’s'
            subtitle=''
            goto='/home'
            bg="yellow"
            font='24px'
            paddding={true}
          />
          <div className='ml-28 md:ml-ml-28  max-sm:ml-[1.3rem] md:pr-[4rem] pr-4 mt-5'>
            <div className='pt-8 max-lg:px-2 px-16'>
              {/* <p className="font-montserrat font-normal leading-[35px] text-[15px] capitalize text-center"
                style={{ wordSpacing: '1px' }}
                dangerouslySetInnerHTML={{ __html: data }}
              /> */}

              {data?.length ? data.map((faq: any, index: number) => {
                return <div key={index}>
                  <div >
                    <p className='className="font-montserrat font-semibold leading-[35px] text-2xl underline capitalize text-center"'>
                      {faq?.attributes?.question}
                    </p>
                  </div>
                  <p className="font-montserrat font-normal leading-[35px] text-[15px] capitalize ">
                    {faq?.attributes?.answer}
                  </p>
                </div>
              })
                :
                ""
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Faqs;
