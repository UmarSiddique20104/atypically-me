"use client"
import bg from "../../../../assets/images/welcomeBg6.png";
import Link from "next/link";
import LeftForgetIcon from "@/app/components/reuseables/Svgs/LeftForgetIcon";
import NewLeftOval from "@/app/components/reuseables/Svgs/NewLeftOval";
import NewRightIcon from "@/app/components/reuseables/Svgs/NewRightIcon";
import RightWelcomeSvgV2 from "@/app/components/reuseables/Svgs/RightWelcomeSvgV2";
import LeftWelcomeSvg from "@/app/components/reuseables/LeftWelcomeSvg";
import LeftWelcomeOval from "@/app/components/reuseables/Svgs/LeftWelcomeOval";
import LeftWelcome from "@/app/components/reuseables/Svgs/LeftWelcome";
import RightWaterDrop from "@/app/components/reuseables/Svgs/RightWaterDrop";
import WelcomeGirl from "@/app/components/reuseables/Svgs/WelcomeGirl";
import WelcomeCenterSvg from "@/app/components/reuseables/Svgs/WelcomeCenterSvg";
import RightWelcomeSvg from "@/app/components/reuseables/Svgs/RightWelcomeSvg";
import secureLocalStorage from "react-secure-storage";
import "../../../globals.css"
import getAndDecryptCookie, { Encrytion, storeToken } from "@/app/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


const Welcome = () => {
  const containerStyle = {
    backgroundImage: `url(${bg.src})`,
    backgroundSize: "100% 120%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
  };
  const router = useRouter();

  const userclick = () => {
    const Role = Encrytion('user');
    storeToken("role", Role);
    router.push('/sign-up')


  };
  const businessclick = () => {
    const Role = Encrytion('business');
    storeToken("role", Role);
    router.push('/sign-up')

  };
  useEffect(() => {
    const role = getAndDecryptCookie("Role");
    if (role === "user") {
      return router.push('/home')
    }
    else if (role === "business") {
      router.push("/business/dashboard");
    }
  }, [])


  // useEffect(() => {
  //   if (role === "user" && token) {
  //     router.push("/feeling-today");
  //   } else if (role === "business" && token) {
  //     router.push("/business/dashboard");
  //   }
  // }, []);

  return (
    <div className="relative   mx-auto bg-primary h-svh max-sm:overflow-hidden">
      <div className="absolute left-[4%] max-xl:top-[4%] max-2xl:left-[4%] max-xl:left-[12%] max-sm:left-[-50px]  max-md:left-[-10px] max-lg:left-[-10%] max-lg:top-[-10%] pr-12 lg:pb-12">
        <LeftWelcome />
      </div>

      <div className="absolute top-[-7%] max-sm:top-[-28%] max-md:top-[-10%] max-lg:top-[0%] max-xl:top-[-23%]   max-sm:right-0 max-xl:right-0 right-[20%] pr-12 pb-12">
        <RightWaterDrop />
      </div>

      <div className="absolute top-[30%] max-sm:top-[4%] max-md:top-[40%] max-lg:top-[30%]  max-sm:right-[-20%] max-md:right-[0%] max-lg:right-[0%] max-2xl:right-[0%] max-xl:right-[0%] max-sm:pr-0 right-[8%] pr-12 pb-12">
        <RightWelcomeSvg />
      </div>

      <div className="flex relative  z-50 justify-center max-sm:pt-[150px] max-md:pt-[150px] max-lg:pt-[150px] max-xl:pt-[134px] max-2xl:pt-[140px] pt-[140px]">
        <div className="">
          <h1 className="font-montserrat font-[600] text-black text-[25px] text-center">

            Welcome to
          </h1>
          <div>
            <svg
              width="323"
              height="122"
              className=""
              viewBox="0 0 323 122"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M38.2841 60.781L34.4374 51.4744H14.2731L10.4264 60.781H0.127153L19.4848 17.3503H29.4118L48.8315 60.781H38.2841ZM17.4994 43.8431H31.2731L24.3863 27.2153L17.4994 43.8431ZM71.2754 52.343L73.8812 59.1679C71.8958 60.5949 68.9798 61.2774 66.0017 61.2774C58.1221 61.2774 53.5309 57.2445 53.5309 49.3029V35.5912H48.3812V28.146H53.5309V20.0182H63.2097V28.146H71.5236V35.5912H63.2097V49.1788C63.2097 52.0328 64.7608 53.5839 67.3666 53.5839C68.7936 53.5839 70.2206 53.1496 71.2754 52.343ZM102.533 27.4014H111.84L96.7633 62.8285C93.537 70.8941 88.9458 73.3139 82.9275 73.3139C79.5151 73.3139 75.7925 72.1971 73.6209 70.2737L77.1574 63.3868C78.6465 64.6898 80.6939 65.4963 82.6173 65.4963C85.2852 65.4963 86.7742 64.3175 88.0771 61.3394L88.2012 61.0292L73.745 27.4014H83.7341L93.1027 50.0474L102.533 27.4014ZM135.519 26.9051C144.888 26.9051 152.147 33.6058 152.147 44.0912C152.147 54.5766 144.888 61.2774 135.519 61.2774C131.362 61.2774 127.95 59.9744 125.468 57.2445V72.8175H115.789V27.4014H125.034V31.2482C127.454 28.3321 131.052 26.9051 135.519 26.9051ZM133.844 53.3358C138.684 53.3358 142.344 49.8613 142.344 44.0912C142.344 38.3212 138.684 34.8467 133.844 34.8467C129.005 34.8467 125.344 38.3212 125.344 44.0912C125.344 49.8613 129.005 53.3358 133.844 53.3358ZM163.466 22.7482C159.867 22.7482 157.447 20.3905 157.447 17.3503C157.447 14.3102 159.867 11.9525 163.466 11.9525C167.064 11.9525 169.484 14.1861 169.484 17.1642C169.484 20.3905 167.064 22.7482 163.466 22.7482ZM158.626 60.781V27.4014H168.305V60.781H158.626ZM193.419 61.2774C182.562 61.2774 174.806 54.1423 174.806 44.0912C174.806 34.0401 182.562 26.9051 193.419 26.9051C200.43 26.9051 205.952 29.9452 208.372 35.4051L200.865 39.4379C199.065 36.2737 196.397 34.8467 193.357 34.8467C188.456 34.8467 184.609 38.2591 184.609 44.0912C184.609 49.9233 188.456 53.3358 193.357 53.3358C196.397 53.3358 199.065 51.9708 200.865 48.7445L208.372 52.8394C205.952 58.1752 200.43 61.2774 193.419 61.2774ZM227.408 26.9051C237.583 26.9051 243.477 31.6204 243.477 41.7336V60.781H234.419V56.6241C232.62 59.6642 229.145 61.2774 224.244 61.2774C216.426 61.2774 211.773 56.9343 211.773 51.1642C211.773 45.2701 215.93 41.1752 226.105 41.1752H233.799C233.799 37.0182 231.317 34.5985 226.105 34.5985C222.569 34.5985 218.908 35.7774 216.488 37.7007L213.014 30.9379C216.675 28.3321 222.072 26.9051 227.408 26.9051ZM226.664 54.7628C229.89 54.7628 232.682 53.2737 233.799 50.2336V46.8212H227.16C222.631 46.8212 221.204 48.4963 221.204 50.7299C221.204 53.1496 223.251 54.7628 226.664 54.7628ZM252.237 60.781V14.7445H261.916V60.781H252.237ZM270.899 60.781V14.7445H280.578V60.781H270.899ZM313.385 27.4014H322.692L307.615 62.8285C304.389 70.8941 299.798 73.3139 293.779 73.3139C290.367 73.3139 286.644 72.1971 284.473 70.2737L288.009 63.3868C289.498 64.6898 291.546 65.4963 293.469 65.4963C296.137 65.4963 297.626 64.3175 298.929 61.3394L299.053 61.0292L284.597 27.4014H294.586L303.955 50.0474L313.385 27.4014Z"
                fill="black"
              />
              <path
                d="M225.346 71.5767C233.288 71.5767 238.996 76.168 238.996 86.3431V105.453H229.317V87.8322C229.317 82.4344 226.897 79.9526 222.989 79.9526C218.645 79.9526 215.605 82.7446 215.605 88.7008V105.453H205.926V87.8322C205.926 82.4344 203.631 79.9526 199.598 79.9526C195.317 79.9526 192.277 82.7446 192.277 88.7008V105.453H182.598V72.0731H191.843V75.9198C194.324 73.0658 198.047 71.5767 202.328 71.5767C206.981 71.5767 210.952 73.376 213.31 77.0366C215.978 73.6242 220.321 71.5767 225.346 71.5767ZM280.732 88.8869C280.732 89.6315 280.608 90.6862 280.546 91.4928H255.294C256.225 95.6497 259.761 98.1935 264.849 98.1935C268.385 98.1935 270.929 97.1388 273.225 94.9672L278.374 100.551C275.272 104.088 270.619 105.949 264.601 105.949C253.06 105.949 245.553 98.6899 245.553 88.7629C245.553 78.7738 253.184 71.5767 263.36 71.5767C273.163 71.5767 280.732 78.1534 280.732 88.8869ZM263.422 78.8979C259.017 78.8979 255.852 81.5658 255.17 85.8468H271.611C270.929 81.6278 267.765 78.8979 263.422 78.8979Z"
                fill="black"
              />
            </svg>
          </div>
          <p className="font-montserrat font-[700] text-black text-[19.85px] text-center pb-6">
            Sign-up as a...
          </p>
          <div className="absolute max-lg:hidden bottom-[60%] right-[25%]">
            <WelcomeCenterSvg />
          </div>
          <div className="flex items-center gap-5">
            <div
              onClick={userclick}
              className="rounded-[49.635px] cursor-pointer hover:bg-black hover:text-[#fff] border-[1.3px] border-solid w-[163px] h-[54px] flex items-center justify-center border-black"
            >
              <div className="font-montserrat font-[700] leading-normal text-[17.372px]">
                User
              </div>
            </div>
            <div
              onClick={businessclick}
              className="rounded-[49.635px] cursor-pointer hover:bg-black hover:text-[#fff] border-[1.3px] border-solid w-[163px] h-[54px] flex items-center justify-center border-black">
              <div className="font-montserrat font-[700] leading-normal text-[17.372px]">
                Business
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute  max-sm:hidden max-md:hidden max-lg:hidden left-[20%] bottom-[35%]  pr-12 ">
        <LeftWelcomeSvg />
      </div>
      <div className="absolute   left-0 bottom-0 max-sm:bottom-[15%] right-0 max-sm:left-[-5%] pr-12 pb-12">
        <LeftWelcomeOval />
      </div>

      <div className="absolute bottom-0  right-0 max-sm:right-[-70px] max-sm:bottom-[18%] max-lg  max-sm:pr-0  pr-12">
        <RightWelcomeSvgV2 />
      </div>

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
      >
        <WelcomeGirl />
      </div>
    </div>
  );
};

export default Welcome;
