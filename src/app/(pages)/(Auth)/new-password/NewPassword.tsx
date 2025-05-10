"use client";
import React from "react";
import TextInput from "../components/InputFields";
import Button from "../components/Button";
import LeftForgetIcon from "@/app/components/reuseables/Svgs/LeftForgetIcon";
import NewRightIcon from "@/app/components/reuseables/Svgs/NewRightIcon";
import NewLeftOval from "@/app/components/reuseables/Svgs/NewLeftOval";
import CustomHeading from "@/app/components/reuseables/CustomHeading";
import { showMessage } from "@/app/components/reuseables/Notification";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { NewPasswordSchema } from "@/app/schema/newPassword";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import "../../../globals.css";

const NewPassword = () => {
  const router = useRouter();
  const initialValues = {
    password: "",
    cpassword: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: NewPasswordSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: (values) => {
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          data: {
            attributes: {
              password: values.password,
              newPassword: values.cpassword,
              confirmPassword: values.cpassword,
            },
          },
        });

        const requestOptions: RequestInit = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(API_ENDPOINTS.NEW_PASSWORD, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result?.error[0]?.code === 401) {
              showMessage(result?.error[0]?.detail, "error");
            } else {
              router.push("/sign-in");
              showMessage("Password Updated Successfully!");
            }
          })
          .catch((error) => {
            console.error("error:", error);
          });
      },
    });

  return (
    <div className="bg-primary h-svh w-full overflow-hidden flex flex-col justify-center items-center relative">
      <div className="absolute top-[0%] right-[8%] pr-12 pb-12 transform rotate-180">
        <LeftForgetIcon />
      </div>
      <div className="relative z-10 ">
        <div className="">
          <CustomHeading FontWeight={700} title="New Password" />
          <form onSubmit={handleSubmit} className="flex flex-col w-full justify-center items-center">
            <div className="relative ">
              <TextInput
                placeholder="New Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && touched.password && (
                <p className="absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="relative">
              <TextInput
                placeholder="Confirm Password"
                type="password"
                name="cpassword"
                value={values.cpassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.cpassword && touched.cpassword && (
                <p className="absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                  {errors.cpassword}
                </p>
              )}
            </div>
            <div className="text-center pt-[19px]">
              <div className="pt-[40px]">
                <div>
                  <Button type="submit">Update</Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="absolute max-sm:left-[2%] z-0 max-sm:bottom-[0%] max-md:bottom-[10%] left-[4%] bottom-[6%] pr-12 pb-12">
        <NewLeftOval />
      </div>
      <div className="absolute bottom-0 right-[3%] pr-4 pb-8">
        <NewRightIcon />
      </div>
    </div>
  );
};

export default NewPassword;
