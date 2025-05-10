"use client"
import React, { useEffect, useState } from 'react'
import Lollipop from '../../components/lollipop'
import LollipopEmpty from '../../components/lollipopEmpty'
import Inactivepop from '../../components/lollipopInactive'
import getAndDecryptCookie from '@/app/lib/auth'
import { createHeaders, createRequestOptions, fetchApi } from '@/app/components/utils/Helper'
import API_ENDPOINTS from '@/app/components/ApiRoutes/apiRoutes'
import { showMessage } from '@/app/components/reuseables/Notification'
import { useParams } from 'next/navigation'


const RateTheBusinessTemp = () => {

  const [isLoading, setIsLoading] = useState(false)
  const token = getAndDecryptCookie('AccessToken');
  const id = getAndDecryptCookie('Id');
  const params = useParams()
  const businessId = params.id
  const RateTheBusiness = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const formdata = new FormData();
    formdata.append("ambience", `${Ambience + 1}`);
    formdata.append("quality", `${Quality + 1}`);
    formdata.append("service", `${Service + 1}`);
    const requestOptions = createRequestOptions("POST", headers, formdata);
    const url = `${API_ENDPOINTS.POST_REVIEW_FOR_BUSINESS + businessId}`;
    try {
      const result = await fetchApi(url, requestOptions);

      if (result?.success && result?.status === 200) {
        showMessage(result?.message,);


        setIsLoading(false);
      } else {
        showMessage(result?.message, "error");
        console.error('API Response Error:', result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('GetDeals error:', error);
      setIsLoading(false);
    }
  };

  const [Ambience, setAmbience] = useState<number>(-1)
  const [Quality, setQuality] = useState<number>(-1)
  const [Service, setService] = useState<number>(-1)

  useEffect(() => {
    if ((Ambience + 1 <= 0) || (Quality + 1 <= 0) || (Service + 1 <= 0)) {
      // 
    } else {
      RateTheBusiness()
    }
  }, [Ambience, Quality, Service])

  return (
    <>
      <div className='grid grid-cols-12 '>

        <div className="md:col-span-4 sm:col-span-6 col-span-12   flex flex-col justify-center">
          <p className="text-black text-lg font-medium font-inter flex justify-center items-center py-2">
            Ambience
          </p>
          <div className="flex justify-center items-center">
            <div className="flex ">


              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} onClick={() => setAmbience(index)}>

                  {Ambience >= index ? <Lollipop /> : <Inactivepop />}
                </span>
              ))}


            </div>
          </div>
        </div>
        {/* 3 */}
        <div className="md:col-span-4 sm:col-span-6 col-span-12  flex flex-col justify-center">
          <p className="text-black text-lg font-medium font-inter flex justify-center items-center py-2">
            Quality
          </p>
          <div className="flex justify-center items-center">
            <div className="flex ">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} onClick={() => setQuality(index)}>

                  {Quality >= index ? <Lollipop /> : <Inactivepop />}
                </span>
              ))}

            </div>
          </div>
        </div>
        {/* 4 */}
        <div className="md:col-span-4 sm:col-span-6 col-span-12 flex flex-col justify-center">
          <p className="text-black text-lg font-medium font-inter flex justify-center items-center py-2">
            Service
          </p>
          <div className="flex justify-center items-center">
            <div className="flex ">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} onClick={() => setService(index)}>

                  {Service >= index ? <Lollipop /> : <Inactivepop />}
                </span>
              ))}

            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default RateTheBusinessTemp