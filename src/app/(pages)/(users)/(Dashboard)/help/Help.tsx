'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainHeader from '@/app/components/sidebar/MainHeader/MainHeader';
import line2 from '../../../../../../public/assets/images/line2.png';
import Button from '@/app/components/reuseables/Svgs/Button';
import TextInput from '@/app/components/reuseables/TextInput';
import '../../../../globals.css'
import { HelpSchema } from '@/app/schema/HelpSchema';
import { useFormik } from 'formik';
import { showMessage } from '@/app/components/reuseables/Notification';
import API_ENDPOINTS from '@/app/components/ApiRoutes/apiRoutes';
import getAndDecryptCookie from '@/app/lib/auth';
import axios from 'axios';
import { Loader } from '@/app/components/reuseables/Svgs/Loader';

const Help = () => {
  const token = getAndDecryptCookie("AccessToken");
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: "",
    subject: "",
    details: "",
  };
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: HelpSchema,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: (values, action) => {
        setIsLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const data = {
          data: {
            attributes: values,
          },
        };

        axios
          .post(API_ENDPOINTS.SUPPORT, data, config)
          .then((response) => {
            const result = response?.data?.data;
            if (response.status === 200 || response.status === 201) {
              setIsLoading(false);
              showMessage("Your Support Query Has Been Sent");
            } else {
              setIsLoading(false);
              showMessage('Failed to send message', 'error');
            }
          })
          .catch((error) => {
            setIsLoading(false);
            showMessage(error?.response?.data?.error[0]?.title, "error");
            setIsLoading(false);
          });
      },
    });

  return (
    <>
      {isLoading &&
        <div className="w-full h-8 flex justify-center items-center">
          <div className="loaderScreen"><Loader /></div>
        </div>
      }
      <div className="flex min-h-screen bg-primary">

        <div className='flex flex-col w-full'>
          <MainHeader
            title='Help'
            subtitle=''
            goto='/home'
            bg="orange-darker"
            font='24px'
            paddding={true}
          />
          <div className='ml-28  flex justify-center items-center  max-sm:ml-[1.3rem] md:ml-ml-28 md:pr-[4rem] pr-4 pb-2'>
            <div className='max-lg:px-2 px-16 pt-[52px]'>
              <form onSubmit={handleSubmit}>
                <div className='relative text-center'>
                  <input
                    style={{ background: "rgba(255, 255, 255, 0.70)" }}
                    className="px-[10px] py-[10px] text-center rounded-[10px] w-[90vw] 
          sm:w-[779px] font-montserrat font-medium
          leading-normal text-[15] placeholder-black"
                    placeholder={'Your Email Address'}
                    type={'email'}
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email && (
                    <p className="absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                      {errors.email}
                    </p>
                  )}

                </div>

                <div className='pt-[30px] relative text-center'>
                  <div>
                    <input
                      style={{ background: "rgba(255, 255, 255, 0.70)" }}
                      className="px-[10px] py-[10px] text-center rounded-[10px] w-[90vw] 
          sm:w-[779px] font-montserrat font-medium
          leading-normal text-[15] placeholder-black"
                      placeholder={'Subject'}
                      type={'text'}
                      name="subject"
                      value={values.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                  </div>
                  {errors.subject && touched.subject && (
                    <p className="absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className="pt-[30px]">
                  <div>
                    <textarea
                      style={{ background: "rgba(255, 255, 255, 0.70)" }}
                      className={`w-full h-[449px] border rounded-[18px] p-5 focus:outline-none focus:outline-black
          font-montserrat text-[15px] font-medium leading-normal text-black placeholder:text-black`}
                      placeholder="Text"
                      name="details"
                      value={values.details}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    {errors.details && touched.details && (
                      <p className="bottom-5 ms-3 text-red-500 text-xs ">
                        {errors.details}
                      </p>
                    )}
                  </div>
                </div>
                <div className='pt-7 text-center'>
                  <Button type='submit' className='text-xl px-[55px] py-[9px]'>
                    Send
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Help;
