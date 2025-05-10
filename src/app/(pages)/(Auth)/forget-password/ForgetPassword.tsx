
"use client";
import React, { useState } from "react";
import Button from "../components/Button";
import TextInput from "../components/InputFields";
import RightForgetIcon from "@/app/components/reuseables/Svgs/RightForgetIcon";
import LeftForgetIcon from "@/app/components/reuseables/Svgs/LeftForgetIcon";
import CustomHeading from "@/app/components/reuseables/CustomHeading";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { useRouter } from "next/navigation";
import { ForgetSchema } from "@/app/schema/forgetPassword";
import { useFormik } from "formik";
import { showMessage } from "@/app/components/reuseables/Notification";
import  "../../../globals.css"

const ForgetPassword = () => {
  const router = useRouter();
  const initialValues = {
    email: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: ForgetSchema,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: (values, action) => {
        const myHeaders = new Headers();
        myHeaders.append("Origin", "*");
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          data: {
            attributes: {
              email: values.email,
            },
          },
        });

        var requestOptions: RequestInit = {
          method: "PATCH",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        fetch(API_ENDPOINTS.FORGET_PASSWORD, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result?.data && result?.data?.attributes?.email) {
              showMessage(" User  verified!"); 
              router.push("/reset-password");
            } else if (result.error) {
              showMessage(result.error[0]?.title,"error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },
    });
  return (
    <div className="bg-primary min-h-svh flex flex-col justify-center items-center relative">
      <div className="absolute top-[4%] right-0 pr-12 max-sm:pr-6 pb-12">
        <RightForgetIcon />
      </div>
      <div className="relative z-10">
        <form onSubmit={handleSubmit}>
          <div className="">
            <CustomHeading FontWeight={700} title="Forgot Password" />

            <h1
              className="font-montserrat font-[700]
                     leading-normal  text-[15px] text-black text-center"
            >
              Please enter your registered email address
            </h1>
            <div className="text-center flex  justify-center w-full">
              <div className="relative">
                <TextInput
                  placeholder="Email"
                  type="email"
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
            </div>
          </div>

          <div className="text-center pt-[19px] ">
            <div className="pt-[40px] ">
              <Button type="submit">Continue</Button>
            </div>
          </div>
        </form>
      </div>

      <div className="absolute bottom-0 left-[5%] right-0 pr-12 pb-12 max-sm:pb-1 max-lg:pb-0">
        <LeftForgetIcon />
      </div>
    </div>
  );
};

export default ForgetPassword;
// href={'/reset-password'}
