"use client";
import React, { useCallback, useEffect, useState } from "react";
import "./styles.css";
import "@/app/globals.css";
import slider1 from "@/assets/images/slider1.png";
import slider2 from "@/assets/images/slider2.png";
import slider3 from "@/assets/images/slider3.png";
import slider4 from "@/assets/images/sllider4.png";
import slider5 from "@/assets/images/slider5.png";
import Image from "next/image";

import Button from "@/app/components/reuseables/Svgs/Button";
import SliderHeader from "./SliderHeader";
import { useRouter } from "next/navigation";
import "../../../globals.css";
import Template1 from "../template-01/page";
import Template2 from "../template-02/page";
import Template3 from "../template-03/page";
import Template4 from "../template-04/page";
import Template5 from "../template-05/page";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import { showMessage } from "@/app/components/reuseables/Notification";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { Deal } from "@/types/deals";
import getAndDecryptCookie from "@/app/lib/auth";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { useDispatch } from "react-redux";
import {
  saveDealsList,
  setError,
  setLoading,
} from "@/app/redux/templatesDataSlice";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";
export default function App() {
  const SliderMap = [
    {
      id: 1,

      image: slider1,
      url: "Description 1",
    },
    {
      id: 2,
      image: slider2,
      url: "Description 2",
    },
    {
      id: 3,
      image: slider3,
      url: "Description 3",
    },
    {
      id: 4,
      image: slider5,
      url: "Description 4",
    },
    {
      id: 5,
      image: slider4,
      url: "Description 5",
    },
  ];
  const [template, setTemplate] = useState<any>(0);
  const [active, setActive] = useState<any>(0);
  const [isLoading, setIsLoading] = useState(false);
 

  const router = useRouter();
 
  const userId = getAndDecryptCookie("Id");
  const token = getAndDecryptCookie("AccessToken");
  useTokenRedirect();

  const GetTemplatesNumber = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GetTemplatesNumber}/${userId}`;
    try {
      const result = await fetchApi(url, requestOptions);
      if (result?.success && result?.status === 200) {
        const activeId = result?.data?.templeteNumber;
  
        if (activeId) {
          setTemplate(activeId);
          setActive(activeId-1);
 
        }else{
          setTemplate(1);
          setActive(0);
        }
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
  useEffect(() => {
    if (!token) {
      router.push("/welcome");
    }else{

      GetTemplatesNumber();
    }
    
  }, []);

 
  const handleNavigate = () => {
    console.log("Template===>", template);
    if (template === 1) {
      router.push("/business/template-01");
    } else if (template === 2) {
      router.push("/business/template-02");
    } else if (template === 3) {
      router.push("/business/template-03");
    } else if (template === 4) {
      router.push("/business/template-04");
    } else if (template === 5) {
      router.push("/business/template-05");
    }else{
      router.push("/business/select-template");
    }
  };

  const SendTemplatesNumber = async () => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const raw = JSON.stringify({
      templeteNumber: template,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${API_ENDPOINTS.SendTamplatesNumber}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.success && result?.status === 200) {
          handleNavigate();
          setIsLoading(false);
          // showMessage(result?.message);
        } else {
          showMessage(result?.message, "error");
          console.error("API Response Error:", result);
          setIsLoading(false);
        }
      })
      .catch((error) => console.error(error));
  };
 
 

  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="w-full sm:flex  h-full block">
        <div className="xl:w-60 sm:w-28 sm:block hidden px-2 bg-black   fixed xl:left-20 top-0 left-14 h-full">
          <div className="slider-overflow ps-6 h-full overflow-y-auto ">
            <div className="flex flex-col justify-center items-center gap-5  max-sm:pt-10 md:gap-0 h-svh xl:mt-20 ">
              {SliderMap.map((item, index) => {
                return (
                  <div
                    key={index}
                    tabIndex={index}
                    className="my-3 ms-2 h-svh  cursor-pointer max-sm:ps-10 max-sm:pt-2    max-md:pt-0 "
                    onClick={() => {setTemplate(index+1) ;    setActive(index);}}
                  >
                    <div
                      className={` xl:w-32 xl:h-32 w-20 h-20   ${
                        active   === index
                          ? "border-4  border-purple-500 rounded-xl"
                          : ""
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.url}
                        height={200}
                        width={200}
                        unoptimized
                        className=" h-full object-fill w-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden  xl:ps-72 xl:pe-20 sm:ps-32   ps-3  pe-4 bg-primary   ">
          <div className="flex justify-center items-center  py-10  max-sm:pt-36  ">
            <div className=" w-full     ">
              <SliderHeader title="Select a Template" />
            </div>
          </div>
          <div className="max-sm:mx-[4px] m-10 p-4   shadow-2xl  overflow-y-auto overflow-hidden w-full    rounded-[37px]  3xl:container     ">
            {template === 1 && <Template1 />}
            {template === 2 && <Template2 />}
            {template === 3 && <Template3 />}
            {template === 4 && <Template4 />}
            {template === 5 && <Template5 />}
          </div>

          {/* {template && ( */}
          <div className=" flex justify-center items-center py-10">
            <span onClick={() => SendTemplatesNumber()}>
              <Button>Select</Button>
            </span>
          </div>
          {/* // )} */}
        </div>
        <div className="sm:hidden block bg-black  py-3 px-2">
          <div className="w-full h-24 no-scrollbar overflow-x-auto overflow-y-hidden">
            <div className="flex w-max items-center justify-center px-1 gap-5">
              {SliderMap.map((item, index) => {
                return (
                  <div
                    key={index}
                    tabIndex={index}
                    className="cursor-pointer"
                    onClick={() =>{setTemplate(index+1)  ;    setActive(index);}}
                  >
                    <div
                      className={`h-24 ${
                        active   === index
                          ? "border-4 border-purple-500 rounded-xl"
                          : ""
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.url}
                        height={200}
                        width={200}
                        unoptimized
                        className="h-full w-24 object-cover"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
