"use client";
import React, { useEffect } from "react";
import TextInput from "../components/InputFields";
import Button from "../components/Button";
import LeftForgetIcon from "@/app/components/reuseables/Svgs/LeftForgetIcon";
import NewRightIcon from "@/app/components/reuseables/Svgs/NewRightIcon";
import NewLeftOval from "@/app/components/reuseables/Svgs/NewLeftOval";
import CustomHeading from "@/app/components/reuseables/CustomHeading";
import { showMessage } from "@/app/components/reuseables/Notification";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { ChangePasswordSchema } from "@/app/schema/ChangePassword"; // Update the schema import
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import "../../../globals.css";
import getAndDecryptCookie from "@/app/lib/auth";

const ChangePassword = () => {
  const router = useRouter();
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const token = getAndDecryptCookie("AccessToken");
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: ChangePasswordSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: (values) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          data: {
            attributes: {
              password: values.currentPassword,
              newPassword: values.newPassword,
              confirmPassword: values.confirmPassword,
            },
          },
        });

        const requestOptions: RequestInit = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(API_ENDPOINTS.CHANGE_PASSWORD, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log('result---->', result)

            if (result?.error) {
              if (result?.error?.[0]?.code) {
                showMessage(result?.error[0]?.title, "error");
              }
            } else {
              console.log('else running---->', result)
              showMessage("Password Updated Successfully!");
              router.push("/settings");
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
          <CustomHeading FontWeight={700} title="Change Password" />
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full justify-center items-center"
          >
            <div className="relative ">
              <TextInput
                placeholder="Current Password"
                type="password"
                name="currentPassword"
                value={values.currentPassword} // Use values instead of initialValues
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.currentPassword && touched.currentPassword && (
                <p className="absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div className="relative">
              <TextInput
                placeholder="New Password"
                type="password"
                name="newPassword"
                value={values.newPassword} // Use values instead of initialValues
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.newPassword && touched.newPassword && (
                <p className="absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="relative">
              <TextInput
                placeholder="Re-enter Password"
                type="password"
                name="confirmPassword"
                value={values.confirmPassword} // Use values instead of initialValues
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="text-center pt-[19px]">
              <div className="pt-[40px]">
                <div>
                  <Button type="submit">Submit</Button>
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

export default ChangePassword;