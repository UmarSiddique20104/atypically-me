"use client";
import "../../../globals.css";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import deal1 from "../../../../../public/assets/images/deals.png";
import Link from "next/link";
import BussinessEditHeader from "@/app/components/sidebar/BusinessHeader/BussinesEditHeader";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { showMessage } from "@/app/components/reuseables/Notification";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import { Deal } from "@/types/deals"; // Adjust the path as necessary
import Verticle from "../components/discountVerticle";
import DealsCard from "../components/DealsCard";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { useDispatch } from "react-redux";
import { saveDealData } from "@/app/redux/dealsSlice";
import { useRouter } from "next/navigation";
import getAndDecryptCookie, { Decrytion } from "@/app/lib/auth";
import secureLocalStorage from "react-secure-storage";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";

function Deals() {
  const [dealsList, setDealsList] = useState<Deal[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [hasMorePages, setHasMorePages] = useState(true); // New state to track if there are more pages
  const token = getAndDecryptCookie("AccessToken");
  const navigate = useRouter();
  const dispatch = useDispatch();
  useTokenRedirect();
  const handleItemClick = (dealData: any) => {
    dispatch(saveDealData(dealData));
    navigate.push("/business/edit-deal");
  };
  const role = secureLocalStorage.getItem("role");
  const router = useRouter();
  // const token = getAndDecryptCookie("AccessToken");
  useEffect(() => {
    if (!token) {
      router.push("/welcome");
    }
  }, []);
  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading && hasMorePages) {
        // Check if there are more pages
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isLoading, hasMorePages]); // Update the useEffect dependencies

  const getDeals = useCallback(
    async (data: boolean) => {
      if (!data) {
        if (!hasMorePages) return; // Stop calling API if there are no more pages
      }
      setIsLoading(true);
      const headers = createHeaders(token ? token : "");
      const requestOptions = createRequestOptions("GET", headers);
      const url = `${API_ENDPOINTS.GETDEALS}/next-page=${page}`;
      try {
        const result = await fetchApi(url, requestOptions);
        handleApiResponse(result);
      } catch (error) {
        console.error("GetDeals error:", error);
        setIsLoading(false);
      }
    },
    [page, hasMorePages]
  );

  const handleApiResponse = (result: any) => {
    if (result?.success && result?.status === 200) {
      setIsLoading(false);
      setPage(1);
      setDealsList((prevDeals) =>
        page === 1 ? result?.data?.deals : [...prevDeals, ...result.data.deals]
      );

      const pagination = result?.data?.pagination;
      if (pagination) {
        const { nextPage } = pagination;
        setHasMorePages(nextPage !== 0); // Update hasMorePages based on nextPage value
      } else {
        setHasMorePages(false); // No pagination information means no more pages
      }
    } else {
      // showMessage(result?.error[0]?.title, "error");
      console.error("API Response Error:", result);
      setIsLoading(false);
    }
  };

  const DeleteDeal = async (id: any) => {
    setIsLoading(true);
    const headers = createHeaders(token ? token : "");
    const requestOptions = createRequestOptions("DELETE", headers);
    const url = `${API_ENDPOINTS.DELETEDEAL}/${id}`;

    try {
      const result = await fetchApi(url, requestOptions);
      showMessage(result.message, "success");
      // Reset state to fetch fresh data from page 1
      setPage(1);
      setHasMorePages(true);
      getDeals(true); // Fetch fresh data after deletion
    } catch (error) {
      console.error("DeleteDeal error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDeals(false);
  }, [page]);

  return (
    <>
      <div className="flex max-sm:ps-0 ps-20 min-h-svh">
        <div className="flex flex-col  items-center px-[29px] max-sm:px-[10px] w-full bg-[#F5F5F5]">
          <div className="py-4 mt-20 w-full px-9 max-sm:px-2 max-sm:mt-44">
            <BussinessEditHeader
              padding={false}
              link="/business/add-deals"
              mainTitle="Deals"
              colour="bg-[#f5f5f5]"
            />
            {dealsList.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="font-semibold text-lg">No Deals Found</p>
              </div>
            ) : (
              dealsList.map((deal, index) => (
                <>
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <DealsCard
                        mainHeading={deal?.discount}
                        subHeading={deal?.offer}
                        image={deal?.image}
                        title={deal?.title}
                        bgColor={""}
                      />
                    </div>
                    <div className="flex items-center cursor-pointer">
                      <div className="pe-4">
                        <div onClick={() => handleItemClick(deal)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="19"
                            viewBox="0 0 18 19"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M15.941 2.10537C14.34 0.503719 13.1376 0.744282 13.1376 0.744282L7.53069 6.34688L1.12011 12.7598L0 18.0459L5.28414 16.9254L11.6947 10.5188L17.3016 4.91616C17.3016 4.91616 17.5421 3.71335 15.941 2.1117V2.10537ZM14.745 4.09951L5.02468 13.4119L4.57537 12.9434L14.2893 3.62472L14.7386 4.09318L14.745 4.09951Z"
                              fill="black"
                            />
                          </svg>
                        </div>
                      </div>
                      <div onClick={() => DeleteDeal(deal.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="21"
                          viewBox="0 0 17 21"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_241_4953)">
                            <path
                              d="M0.785156 4.74109H0.790333L1.63937 5.48064V19.5294C1.63937 20.2179 2.1752 20.7745 2.83787 20.7745H14.2404C14.903 20.7745 15.4389 20.2179 15.4389 19.5294V5.48064L16.2879 4.74109H16.2931V3.50671H0.785156V4.74109ZM11.248 6.68812H12.695V18.771H11.248V6.68812ZM7.81821 6.68812H9.2652V18.771H7.81821V6.68812ZM4.38581 6.68812H5.8328V18.771H4.38581V6.68812Z"
                              fill="black"
                            />
                            <path
                              d="M16.0385 1.73458H10.9883V0.505583C10.9883 0.225899 10.7709 0 10.4991 0H6.57743C6.30822 0 6.09079 0.225899 6.09079 0.505583V1.73458H1.04055C0.880062 1.73458 0.748047 1.86904 0.748047 2.03847V3.00661H16.331V2.03847C16.331 1.87173 16.2016 1.73458 16.0385 1.73458ZM10.0978 1.42531H6.98124V1.08647C6.98124 0.99772 7.05113 0.92511 7.13656 0.92511H9.94253C10.028 0.92511 10.0978 0.99772 10.0978 1.08647V1.42531Z"
                              fill="black"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_241_4953">
                              <rect
                                width="15.583"
                                height="20.7773"
                                fill="white"
                                transform="translate(0.748047)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="border-t-4 border-black border-dotted  my-[30px]"></div>
                </>
              ))
            )}
            <div
              ref={loadMoreRef}
              className="w-full h-8 flex justify-center items-center"
            >
              {isLoading && (
                <div className="loaderScreen">
                  <Loader />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Deals;
