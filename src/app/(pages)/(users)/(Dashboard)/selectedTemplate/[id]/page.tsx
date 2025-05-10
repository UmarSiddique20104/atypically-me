"use client"
import API_ENDPOINTS from '@/app/components/ApiRoutes/apiRoutes'
import { showMessage } from '@/app/components/reuseables/Notification'
import { createHeaders, createRequestOptions, fetchApi } from '@/app/components/utils/Helper'
import getAndDecryptCookie from '@/app/lib/auth'

import React, { useEffect, useState } from 'react'
import Template1 from './template-01/page'
import Template2 from './template-02/page'
import Template3 from './template-03/page'
import Template4 from './template-04/page'
import Template5 from './template-05/page'
import { Loader } from '@/app/components/reuseables/Svgs/Loader'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import useTokenRedirect from '@/app/components/reuseables/useTokenRedirect'


const Page = (id: any) => {

  const slug = id?.params?.id
  const [isLoading, setIsLoading] = useState(false)
  const [templateNumber, setTemplateNumber] = useState<number>()

  const [data, setData] = useState<any>()
  const token = getAndDecryptCookie('AccessToken');
  useTokenRedirect();
  useEffect(() => {
    const GetCategories = async () => {
      setIsLoading(true);
      const headers = createHeaders(token ?? "");
      const requestOptions = createRequestOptions("GET", headers);
      const url = `${API_ENDPOINTS.GET_ALLBUSINESS_USER_DETAILS + slug}`;
      try {
        const result = await fetchApi(url, requestOptions);
        if (result?.success && result?.status === 200) {
          setTemplateNumber(result?.data?.templete?.templeteNumber)
          setData(result?.data)
          // setCategory(categories);
          setIsLoading(false);
        } else {
          // showMessage(result?.error[0]?.title, "error");
          console.error('API Response Error:', result);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('GetDeals error:', error);
        setIsLoading(false);
      }
    };
    GetCategories()
  }, [slug])
  return (
    < >
      {isLoading &&
        <div className="w-full h-8 flex justify-center items-center">
          <div className="loaderScreen"><Loader /></div>
        </div>
      }

      <div className=' '>

        {(data && templateNumber === 1) && <Template1 data={data} />}
        {(data && templateNumber === 2) && <Template2 data={data} />}
        {(data && templateNumber === 3) && <Template3 data={data} />}
        {(data && templateNumber === 4) && <Template4 data={data} />}
        {(data && templateNumber === 5) && <Template5 data={data} />}

      </div>
    </>
  )
}

export default Page

