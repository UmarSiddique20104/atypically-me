import Image from "next/image";
import React from "react";
import DummyImage from "../../../../../../../../public/assets/images/bussinesstarbucks.png";
import Tabs from "../components/Template1Tabs";
import BusinessLogo from "../components/businessLogo";
import dummyImg from "@/assets/images/temp1logo.png"
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";

const Template1 = (data: any) => {
  const image = data?.data?.userProfile?.image

  const mainBannerImage = useSelector((state: RootState) => state.image.mainBannerImage);
  return (
    <>
      <div className=" bg-primary sm:ps-24 max-sm:pt-24  ">
        <div className=" min-h-svh rounded-3xl  ">
          <div className=" bg-primary container mx-auto ">

            <BusinessLogo image={image ? image : dummyImg} title={data?.data?.userProfile?.name} />
            <div className="relative pt-5 ">
                <Image
                  src={mainBannerImage ? mainBannerImage : DummyImage}
                  height={500}
                  width={500}
                  className={" bg-transparent !h-[250px] !w-full mb-[23.57px] object-fill "}
                  alt="image"
                  unoptimized
                />


            </div>

            <div className="pt-3 ">
              <Tabs data={data} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Template1;
