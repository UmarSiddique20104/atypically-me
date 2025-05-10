"use client";
import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
import TreatsHeader from "@/app/components/sidebar/TreatsHeader/TreatsHeader";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import treats1 from "../../../../../../public/assets/images/treats1.png";
import treats2 from "../../../../../../public/assets/images/treats2.png";
import treats3 from "../../../../../../public/assets/images/treats3.png";
import treats4 from "../../../../../../public/assets/images/treats4.png";
import "../../../../globals.css";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import getAndDecryptCookie from "@/app/lib/auth";
import Link from "next/link";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { useDispatch } from "react-redux";
import { setImage } from "@/app/redux/imageSlice";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";

const Treats = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const token = getAndDecryptCookie("AccessToken");
  useTokenRedirect();
  const handleSelectedOption = (option: any) => {
    setSelectedOption(option);
  };
  const getData = async (token: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.GET_ALLBUSINESS_USER, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch topics: ${res.statusText}`);
      }
      const result = await res.json();
      setIsLoading(false);
      setData(result?.data?.users);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching topics:", error);
    }
  };

  const filterDeals = () => {
    return data.filter((deal) =>
      deal.businessCategory.toLowerCase().includes(selectedOption.toLowerCase())
    );
  };

  useEffect(() => {
    getData(token);
  }, []);

  const dispatch = useDispatch();
  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="flex min-h-svh bg-[#F4EEE2]">
        <div className="flex flex-col w-full ">
          <TreatsHeader
            goto="/home"
            onSelectedOptionChange={handleSelectedOption}
          />

          <div className="flex justify-center items-center max-md:pt-80 max-lg:pt-[21rem] lg:pt-[15rem]  flex-col sm:flex-row  ps-28 pe-4 max-sm:pe-[10px] max-sm:ps-[10px] pb-[30px]">
            {/* Left content */}
            {filterDeals()?.length > 0 ? (
              <div>
                {filterDeals()?.map((item: any, index: any) => {
                  return (
                    <div className="w-full mb-5 rounded-[14.261px]" key={index}>
                      <Link
                        href={{
                          pathname: "/selectedTemplate/" + item?.id,
                        }}
                        onClick={() =>
                          dispatch(setImage(item?.details?.mainBannerImage))
                        }
                      >
                        <Image
                          src={
                            item?.details?.mainBannerImage
                              ? item?.details?.mainBannerImage
                              : treats1.src
                          }
                          width={2000}
                          height={2000}
                          alt="treats1"
                          unoptimized
                          className="!w-full h-[11.5rem] border-[1.426px] border-solid border-[#000] object-fill   rounded-[14.261px]"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-base text-black font-bold pt-5">
                No Deals Available for this Category
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Treats;

{
  /* <Image src={item?.details?.mainBannerImage ? item?.details?.mainBannerImage : treats1.src} alt='treats1' width={995} height={184.827} className='h-64 object-cover   rounded-md w-[100%]' /> */
}
