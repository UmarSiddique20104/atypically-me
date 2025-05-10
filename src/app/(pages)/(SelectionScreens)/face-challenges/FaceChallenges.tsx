"use client";
import React, { useEffect, useReducer, useState } from "react";
import Button from "@/app/components/reuseables/Svgs/Button";
import CustomHeadingV2 from "@/app/components/reuseables/CustomHeadingV2";
import "../../../globals.css";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import getAndDecryptCookie from "@/app/lib/auth";
import { showMessage } from "@/app/components/reuseables/Notification";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";

interface Condition {
  name: string;
  color: string;
  icon: JSX.Element;
}

const FaceChallenges = () => {
  const token = getAndDecryptCookie("AccessToken");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [getUserChallenges, setgetUserChallenges] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();
  const getChallenges = async () => {
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GET_CHALLANGES}`;
    try {
      setIsLoading(true);
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
  useEffect(() => {
    getChallenges();
  }, []);
  useEffect(() => {
    handleGetUserChallenges();
  }, []);

  const toggleSelection = (itemName: string) => {
    if (selectedItems.includes(itemName)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== itemName)
      );
    } else {
      setSelectedItems([...selectedItems, itemName]);
    }
  };
  const hadlePostChallenges = () => {
    if (selectedItems?.length > 0) {
      setIsLoading(true);
      const url = `${API_ENDPOINTS.POST_CHALLANGES}`;
      const myHeaders = new Headers();

      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
      const raw = JSON.stringify({
        data: {
          attributes: {
            challengeIds: selectedItems,
          },
        },
      });

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result?.data) {
            router?.push("/feelings-today");
            setIsLoading(false);
          } else if (result?.error) {
            showMessage(result?.error[0]?.title, "error");
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);

          setIsLoading(false);
        });
    } else {
    }
  };

  const handleGetUserChallenges = () => {
    setIsLoading(true);

    const url = `${API_ENDPOINTS.GETUSER_CHALLANGES}`;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,

      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.data) {
          setgetUserChallenges(true);
        } else {
          setIsLoading(false);
          router?.push("/feeling-today");
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="bg-primary min-h-svh py-[30px] font-bold flex flex-col justify-center items-center relative">
        <div>
          <div>
            <CustomHeadingV2
              lineBreak={true}
              title="What"
              emphasizedText="different challenges"
              restOfText="do you face?"
              restOfText2=""
            />
          </div>
          {data?.length > 0 && (
            <div className="grid-container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[12px] pt-[60px]">
              {data?.map((item, index) => (
                <div
                  key={index}
                  className={`condition rounded-lg text-center  flex flex-col items-center`}
                  onClick={() => toggleSelection(item?.id)}
                >
                  <div
                    style={{ backgroundColor: item?.attributes?.color }}
                    className={` cursor-pointer rounded-[21.277px] w-[115.957px] h-[115.957px] flex justify-center items-center ${
                      selectedItems.includes(item?.id)
                        ? "border-2 border-black"
                        : ""
                    }`}
                  >
                    <img
                      className="h-[ 55.319px] w-[53.192px]  object-cover"
                      src={item?.attributes?.icon}
                      alt="profileAvatar"
                    />
                  </div>

                  <div className="condition-name w-[115.957px] pt-[9px]">
                    <p className="font-montserrat font-[700] leading-[1.3rem] text-black text-[14.894px] text-center">
                      {item?.attributes?.name}
                    </p> 
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center pt-[50px]">
            <span onClick={hadlePostChallenges}>
              <Button>Continue</Button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaceChallenges;
