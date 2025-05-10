"use client"
import GoogleIcon from '@/app/components/reuseables/Svgs/GoogleIcon';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import Button from '../components/Button';
import TextInput from "../components/InputFields";
import CustomHeading from '@/app/components/reuseables/CustomHeading';
import { SignupSchema } from '@/app/schema/signup';
import { useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';
import { useFormik } from 'formik';
import API_ENDPOINTS from '@/app/components/ApiRoutes/apiRoutes';
import { showMessage } from '@/app/components/reuseables/Notification';
import FacobookIcon from '../../../../assets/svgs/auth/FacebookIcon.svg'
import { useDispatch, useSelector } from 'react-redux';
import getAndDecryptCookie, { Encrytion, storeToken } from '@/app/lib/auth';
import { Loader } from '@/app/components/reuseables/Svgs/Loader';

function SocialLogin() {
  const socialLoginData = useSelector((state: any) => state?.socialLogin);
  const token = getAndDecryptCookie('AccessToken');
  const role = secureLocalStorage.getItem("role");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedGenderState, setSelectedGenderState] = useState(false);
  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
  };

  const initialValues = {
    fname: socialLoginData?.name,
    lname: socialLoginData?.lname,
    Nname: "",
    email: socialLoginData?.email,
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      // validationSchema: SignupSchema,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: (values, action) => {
        setIsLoading(true);
        if (selectedGender === "") {
          setIsLoading(false);
          setSelectedGenderState(true);
          return;
        }
        setSelectedGenderState(false);
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Origin", "*");
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          data: {
            attributes: {
              firstName: values.fname,
              lastName: values.lname,
              email: values.email,
              nickName: values.Nname,
              gender: selectedGender,
            },
          },
        });

        var requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        fetch(API_ENDPOINTS.SOCIALLOGIN, requestOptions)
          .then((response) => response.json())
          .then((result: any) => {
            if (
              result?.success &&
              (result?.status == 200 || result?.status == 201)
            ) {
              setIsLoading(false);
              showMessage("Account created Successfully!");
              const NickName = Encrytion(result.message.data.attributes?.nickName);
              const Gender = Encrytion(result.message.data.attributes?.gender);
              const FirstName = Encrytion(result.message.data.attributes?.firstName);
              const LastName = Encrytion(result.message.data.attributes?.lastName);
              storeToken("NickName", NickName);
              storeToken("Gender", Gender);
              storeToken("FirstName", FirstName);
              storeToken("LastName", LastName);
              
              router.push("/home");
            } else {
              setIsLoading(false);
              showMessage(result?.message, "error");
            }
          })
          .catch((error) => {
            showMessage('Something wents wrong!', "error");
            console.log("error", error);
          });
      },
    });

  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="bg-lightOrange min-h-[100vh] flex justify-center items-center">
        <div className="pt-[70px]">
          <CustomHeading FontWeight={700} title="Sign-up" />
          <form onSubmit={handleSubmit} className=" " noValidate>
            <div className="pt-[20px]">
              <div className="relative">
                <TextInput
                  placeholder="First name"
                  type="text"
                  name="fname"
                  value={values.fname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.fname && touched.fname && (
                  <p className=" absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                    {errors.fname.toString()}
                  </p>
                )}
              </div>

              <div className="relative">
                <TextInput
                  placeholder="Last name"
                  type="text"
                  name="lname"
                  value={values.lname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.lname && touched.lname && (
                  <p className=" absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                    {errors.lname.toString()}
                  </p>
                )}
              </div>

              <div className="relative">
                <TextInput
                  placeholder="Nick name"
                  type="text"
                  name="Nname"
                  value={values.Nname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.Nname && touched.Nname && (
                  <p className=" absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                    {errors.Nname}
                  </p>
                )}{" "}
              </div>

              <div className="relative">
                <div className='sm:pt-[46px] pt-[30px] relative'>
                  <input
                    className="px-[10px] py-[10px] text-center rounded-[48px] w-[90vw] 
                sm:w-[640px] font-montserrat font-[800]
                leading-normal text-[17.101px] placeholder-[#000]"
                    placeholder="Email"
                    type="email"
                    name="email"
                    readOnly
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.email && touched.email && (
                  <p className=" absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                    {errors.email.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="pt-[48px]">
              <div className="sm:flex flex-column  items-center flex-wrap justify-center sm:gap-5 max-sm:gap-y-6">
                <p className="font-montserrat font-[800] text-center pe-5">
                  Gender
                </p>
                <div className="flex justify-center">
                  <div
                    className={`rounded-[49.635px] cursor-pointer bg-[#fff] sm:w-[118px] w-[70vw] max-sm:mt-3 h-[39px] flex items-center justify-center border-black ${selectedGender === "Male"
                      ? "border-black border-[1.2px] border-solid"
                      : ""
                      }`}
                    onClick={() => {
                      handleGenderSelect("Male");
                      setSelectedGenderState(false);
                    }}
                  >
                    <div className="font-montserrat font-[400] text-[#000] leading-normal text-[17.101px]">
                      Male
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div
                    className={`rounded-[49.635px] cursor-pointer bg-[#fff] sm:w-[118px] w-[70vw] max-sm:mt-3 h-[39px] flex items-center justify-center border-black ${selectedGender === "Female"
                      ? "border-black border-[1.2px] border-solid"
                      : ""
                      }`}
                    onClick={() => {
                      handleGenderSelect("Female");
                      setSelectedGenderState(false);
                    }}
                  >
                    <div className="font-montserrat font-[400] text-[#000] leading-normal text-[17.101px]">
                      Female
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div
                    className={`rounded-[49.635px] cursor-pointer bg-[#fff] sm:w-[118px] w-[70vw] max-sm:mt-3 h-[39px] flex items-center justify-center border-black ${selectedGender === "Private"
                      ? "border-black border-[1.2px] border-solid"
                      : ""
                      }`}
                    onClick={() => {
                      handleGenderSelect("Private");
                      setSelectedGenderState(false);
                    }}
                  >
                    <div className="font-montserrat font-[400] text-[#000] leading-normal text-[17.101px]">
                      Private
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
            {selectedGenderState ? (
              <div className="flex justify-start">
                <p className="  ms-3 text-red-500 text-xs ">Select a gender</p>
              </div>
            ) : null}
            <div className="flex justify-center items-center pt-[33px]">
              <Button>Register</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default SocialLogin
