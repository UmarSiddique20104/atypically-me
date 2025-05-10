"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/app/components/reuseables/Svgs/Button";
import Link from "next/link";
import LeftWelcome from "@/app/components/reuseables/Svgs/LeftWelcome";
import Leftfulloval from "@/app/components/reuseables/Svgs/LeftFullOval";
import LeftWelcomeSvg from "@/app/components/reuseables/LeftWelcomeSvg";
import CustomHeading from "@/app/components/reuseables/CustomHeading";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { useRouter } from "next/navigation";
import "../../../globals.css";

const ResetPassword = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resend, setResend] = useState(false); // State to track resend action
  const router = useRouter();
  const inputRef = [useRef<HTMLInputElement>(), useRef<HTMLInputElement>(), useRef<HTMLInputElement>(), useRef<HTMLInputElement>()];

  function handleInput(i: any, e: any) {
    if (e <= "9" && e >= "0") {
      setOtp((otp) => {
        let temp = [...otp];
        temp[i] = e;
        return temp;
      });
      if (i < otp.length - 1) {
        inputRef[i + 1]?.current?.focus();
      }
    } else {
      if (e === "Backspace") {
        if (otp[i] === "") {
          if (i > 0) {
            inputRef[i - 1]?.current?.focus();
          }
        } else {
          setOtp((otp) => {
            let temp = [...otp];
            temp[i] = "";
            return temp;
          });
        }
      }
    }
  }

  const sendCode = async (code: any) => {
    const url = API_ENDPOINTS.GET_CODE + code;
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 204) {
          console.log('error');
        } else {
          console.log(result);
          router.push("/new-password");
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (otp.every(num => num !== '')) {
      const otpString = otp.join('');
      if (otpString.length === 4) {
        sendCode(otpString);
      }
    }
  }, [otp]);

  useEffect(() => {
    if (resend) {
      // Logic to generate new OTP and reset the state
      setOtp(["", "", "", ""]);
      inputRef[0]?.current?.focus();
      setResend(false); // Reset the resend state
      // You can call an API to generate a new OTP here if needed
    }
  }, [resend]);

  const handleResend = () => {
    setResend(true);
  };

  return (
    <div className="bg-primary min-h-svh overflow-hidden flex flex-col justify-center items-center relative">
      <div className="absolute right-[5%] bottom-[5%] max-xl:bottom-[1%] max-2xl:bottom-[8%] max-2xl:right-[4%] max-xl:right-[12%] max-sm:right-[-50px] max-md:right-[-10px] max-lg:right-[-10%] pr-8 lg:pb-6 rotate-[150deg]">
        <LeftWelcome />
      </div>

      <div className="absolute left-0 top-0 max-sm:top-[5%] max-md:top-[10%] max-2xl:top-[15%] max-sm:left-[0%] max-md:left-[5%] max-2xl:left-[8%] pr-12 pb-12">
        <Leftfulloval />
      </div>
      <div className="absolute right-[0px] top-[5%] max-sm:pr-2 pr-12 pb-12">
        <LeftWelcomeSvg />
      </div>
      <div>
        <div className="">
          <CustomHeading FontWeight={700} title="Reset Password" />

          <h1 className="font-montserrat font-[700] leading-normal text-[14px] text-black text-center">
            Please check email.
          </h1>
          <h1 className="font-montserrat font-[700] leading-normal text-[14px] text-black text-center">
            Enter the forwarded code below:
          </h1>
          <div className="text-center">
            <div className="flex justify-center items-center flex-col gap-4">
              <div className="grid-cols-4 grid gap-4 p-4 rounded-md ">
                {otp.map((value: any, index: any) => (
                  <div key={index} className="relative">
                    <input
                      key={index}
                      type="text"
                      name={index}
                      ref={inputRef[index] as React.RefObject<HTMLInputElement>}
                      value={value}
                      onKeyDown={(e) => handleInput(index, e.key)}
                      className="border-2 rounded-[57px] border-black font-bold text-center w-[50px] h-[50px] px-2 flex justify-center items-center"
                    />
                    <span className="absolute top-4 left-5 "> __</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="font-400 text-[12px] font-montserrat leading-[20px] m-0 P-0">
              Did not receive the code?
              <button
                onClick={handleResend}
                className="font-700! text-[12px] font-montserrat leading-[20px]"
              >
                Resend the code.
              </button>
            </p>

            <Link
              href={"#"}
              className="font-400! text-[12px] font-montserrat leading-[20px] underline"
            >
              The code will be resend in 30 seconds.
            </Link>
          </div>
        </div>
        <div className="text-center pt-[19px]">
          <div className="pt-[40px]">
            <Button>Verify</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
