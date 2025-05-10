"use client";
import BussinessSidebar from "@/app/components/sidebar/BussinessSidebar";
import PopularityMeter from "@/app/components/reuseables/PopularityMeter";
import banner from "../../../../../public/assets/images/bussinesstarbucks.png";
import Link from "next/link";
import BusinessHeader from "@/app/components/sidebar/BusinessHeader/BussinessHeader";
import Image from "next/image";
import deal1 from "../../../../../public/assets/images/deals.png";
import deal2 from "../../../../../public/assets/images/Rectangle 118.png";
import dummyImage from "../../../../../public/assets/images/dummyImage.png";

import "../../../globals.css";
import { useCallback, useEffect, useState } from "react";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { showMessage } from "@/app/components/reuseables/Notification";
import getAndDecryptCookie, { Encrytion, storeToken } from "@/app/lib/auth";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { useDispatch } from "react-redux";
import { saveProfileData } from "@/app/redux/profileSlice";
import DashboadDealsCards from "../components/DashboadDealsCards";
import { Deal } from "@/types/deals"; // Adjust the path as necessary
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import DealsImage from "@/../public/assets/template/Temp1(1).svg"
import DealsImage2 from "@/../public/assets/template/Temp1(2).svg"
import DealsImage3 from "@/../public/assets/template/Temp1(3).svg"
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";

function Dashboard() {
  const deals = [
    { id: 1, src: DealsImage,   },
    { id: 2, src: DealsImage2,   },
    { id: 3, src: DealsImage3,   },
    { id: 4, src: DealsImage,   },
    { id: 5, src: DealsImage2,  },
    { id: 6, src: DealsImage3,   },
    { id: 7, src: DealsImage,   }, 
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [review, setReview] = useState([]);
  const [dealsList, setDealsList] = useState<Deal[]>([]);

  const token = getAndDecryptCookie("AccessToken");
  const userId = getAndDecryptCookie("Id");
  const dispatch = useDispatch();
  useTokenRedirect();

  const getProfileData = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GETSINGLEPROFILE}/${userId}`;

    try {
      const result = await fetchApi(url, requestOptions);
      if (result?.success && result?.status === 200) {
        setName(result?.data?.name);
        setBannerImage(result?.data?.mainBannerImage);

        dispatch(saveProfileData(result?.data));
        setIsLoading(false);
      } else {
        // showMessage(result?.error[0]?.title, "error");
        // console.error('API Response Error:', result.error[0]?.title);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error:", error);
      setIsLoading(false);
    }
  };

  const GetSingleUserBusinessReview = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GetSingleUserReviews}/${userId}`;
    try {
      const result = await fetchApi(url, requestOptions);
      if (result?.success && result?.status === 200) {
        setReview(result?.data);
        setIsLoading(false);
      } else {
        // showMessage(result?.error[0]?.title, "error");
        // console.error('API Response Error:', result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("GetDeals error:", error);
      setIsLoading(false);
    }
  };

  const getDeals = useCallback(async () => {
    setIsLoading(true);
    const headers = createHeaders(token ? token : "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GETDEALS}/next-page=${1}`;
    try {
      const result = await fetchApi(url, requestOptions);
      handleApiResponse(result);
    } catch (error) {
      console.error("GetDeals error:", error);
      setIsLoading(false);
    }
  }, []);

  const handleApiResponse = (result: any) => {
    if (result?.success && result?.status === 200) {
      setIsLoading(false);
      setDealsList(result?.data?.deals);
    } else {
      // showMessage(result?.message, "error");
      // console.error('API Response Error:', result);
      setIsLoading(false);
    }
  };

  const router = useRouter();
  // const token = getAndDecryptCookie("AccessToken");
  useEffect(() => {
    if (!token) {
      router.push("/welcome");
    }
    // const role = getAndDecryptCookie("Role");
    // if (role === "user") {
    //   return
    // }
    // else {
    //   router.push("/welcome");
    // }
  }, []);

  useEffect(() => {
    getProfileData();
    GetSingleUserBusinessReview();
    getDeals();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="flex min-h-svh ">
        <BusinessHeader
          colour="bg-[#f5f5f5]"
          title={name}
          subtitle="Welcome to Atypically me"
        />
        <div className="flex flex-col w-full max-sm:px-[15px] max-md:ps-28 max-md:pe-4 max-lg:ps-28 max-lg:pe-4 max-xl:ps-28 max-xl:pe-4 max-2xl:ps-28 max-2xl:pe-4 ps-28 pe-4   py-[30px] bg-primary">
          <div className="border-dashed border-b-2 mt-9 max-sm:mt-36 border-[#000]">
            <PopularityMeter reviewLength={review.length} />
          </div>

          <div className="border-dashed border-b-2 border-[#000]">
            <div className="my-[28px] flex  items-center">
              <p className=" me-[30px] font-montserrat text-[24px] max-sm:text-[20px] font-extrabold leading-normal">
                Main Deal Banner
              </p>

              <Link href={"/business/edit-banner"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="26"
                  viewBox="0 0 22 26"
                  fill="none"
                >
                  <g style={{ mixBlendMode: "multiply", opacity: 0.6 }}>
                    <path
                      d="M16.6752 8.54674C16.7791 8.65207 16.7776 8.8183 16.6757 8.92299L6.5739 19.0027C6.46875 19.1069 6.30294 19.1055 6.19858 19.0035C6.0947 18.8981 6.09618 18.7319 6.19807 18.6272L16.2999 8.54753C16.405 8.44332 16.5708 8.44467 16.6752 8.54674ZM14.9568 6.8165C15.0607 6.92182 15.0592 7.08806 14.9573 7.19275L4.85601 17.2692C4.75086 17.3734 4.58505 17.372 4.48117 17.2667C4.3773 17.1614 4.37877 16.9951 4.48067 16.8904L14.582 6.81403C14.6871 6.70982 14.8529 6.71117 14.9568 6.8165Z"
                      fill="url(#paint0_linear_238_4617)"
                    />
                  </g>
                  <path
                    d="M2.3168 15.9662L3.30112 16.1125L4.50333 18.1655L6.46644 19.5227L6.80203 20.4814L18.3694 8.94182L13.8874 4.42709L2.3168 15.9662ZM16.3819 8.1503C16.4858 8.25563 16.4843 8.42186 16.3824 8.52655L6.28063 18.6062C6.17548 18.7104 6.00966 18.7091 5.9053 18.607C5.80143 18.5017 5.8029 18.3355 5.9048 18.2308L16.0066 8.15109C16.1117 8.04688 16.2776 8.04823 16.3819 8.1503ZM14.6635 6.42006C14.7674 6.52538 14.7659 6.69161 14.664 6.79631L4.56273 16.8727C4.45759 16.9769 4.29177 16.9756 4.1879 16.8703C4.08402 16.7649 4.0855 16.5987 4.18739 16.494L14.292 6.41807C14.3971 6.31386 14.5629 6.31521 14.6668 6.42054L14.6635 6.42006Z"
                    fill="black"
                  />
                  <path
                    d="M4.30626 18.3092L3.18919 16.3089L2.14882 16.1375C2.14882 16.1375 1.38276 18.2974 0.776003 20.078L2.66149 21.9796L6.62756 20.6518L6.27828 19.6511L4.30301 18.3088L4.30626 18.3092Z"
                    fill="black"
                  />
                  <path
                    d="M0.0533017 22.3243C-0.0438731 22.7993 0.446198 22.719 0.446198 22.719L2.35081 22.08L0.670309 20.3854C0.35203 21.3201 0.100194 22.0983 0.0537861 22.3211L0.0533017 22.3243Z"
                    fill="black"
                  />
                  <path
                    d="M14.2469 3.95444C14.1458 3.85285 13.9832 3.85198 13.8818 3.95342C13.7804 4.05486 13.7794 4.21783 13.8805 4.31942L18.4751 8.94744C18.5763 9.04903 18.7388 9.04989 18.8402 8.94846C18.9416 8.84702 18.9426 8.68405 18.8415 8.58246L14.2501 3.95492L14.2469 3.95444Z"
                    fill="black"
                  />
                  <path
                    d="M14.6834 3.51999C14.5823 3.4184 14.4197 3.41754 14.3183 3.51897C14.2169 3.62041 14.2159 3.78338 14.317 3.88497L18.9117 8.51299C19.0128 8.61458 19.1753 8.61545 19.2768 8.51401C19.3782 8.41257 19.3792 8.2496 19.278 8.14801L14.6834 3.51999Z"
                    fill="black"
                  />
                  <path
                    d="M20.5749 5.27487L17.7333 2.4122C17.7333 2.4122 16.9565 1.51772 16.0493 2.43813L14.9226 3.56226L19.321 7.99133L20.5024 6.81208C20.5024 6.81208 21.3057 6.00938 20.5777 5.27861L20.5749 5.27487Z"
                    fill="black"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_238_4617"
                      x1="4.28244"
                      y1="11.9707"
                      x2="17.3515"
                      y2="13.9138"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#7E7E7E" />
                      <stop offset="1" stopColor="#CECECE" />
                    </linearGradient>
                  </defs>
                </svg>
              </Link>
            </div>
            {bannerImage ? (
              <Image
                height={221}
                unoptimized
                width={600}
                src={bannerImage ? bannerImage : banner}
                className="!h-[221px] !w-full mb-[23.57px] object-cover"
                alt=".."
                
              />
            ) : (
              <div className="flex justify-center items-center text-white text-xl font-bold font-montserrat leading-normal border border-solid rounded-2xl bg-[#c2bebe] border-transparent !h-[221px] !w-full mb-[23.57px]">
                + Upload Deal Banner
              </div>
            )}
          </div>

          <div>
            <div className="my-[28px] flex  items-center">
              <p className=" me-[30px] font-montserrat text-[24px] max-sm:text-[20px] font-extrabold leading-normal">
                Current Deals
              </p>
            </div>

            <div className="mt-[18px] h-[450.474px] py-2 flex gap-[10px] overflow-x-scroll max-sm:overflow-scroll max-md:overflow-scroll max-lg:overflow-scroll">
              {dealsList.length  > 0 ? (
                <>
               {
                dealsList
                  .slice(0, 6)
                  .reverse()
                  .map((item) => (
                    <div key={item.id} className="px-1 flex flex-col">
                      <DashboadDealsCards
                        mainHeading={item.discount}
                        subHeading={item.offer}
                        image={item.image}
                        title={item.title}
                        bgColor={""}
                      />
                    </div>
                  ))}
 

                  </>


              ) : (
               
                  <div className="  flex flex-wrap  justify-evenly   sm:gap-3  w-full" >
                  {deals.map((item, index) => (
                    <div className=" w-40 h-40 cursor-pointer" key={index} onClick={()=>router.push("/business/add-deals")}>
                      <Image
                        src={item.src}
                        className="h-full w-full "
                        alt="Deals"
                      />
                    </div>
                  ))}



                  </div>
               
               
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
   {/* <p className="font-montserrat text-[15px] font-semibold leading-normal">
                    No deals available now
                  </p> */}