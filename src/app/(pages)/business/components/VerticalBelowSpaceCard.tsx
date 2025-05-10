import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { saveDealData } from "@/app/redux/dealsSlice";

const VerticalBelowSpaceCard = ({
  mainHeading,
  subHeading,
  image,
  bgColor, dispatchData
}: any) => {
  const router = useRouter()
  const dispatch = useDispatch();
  const handleItemClick = (dealData: any) => {
    dispatch(saveDealData(dealData));
    router.push("/business/edit-deal");
  };
  return (
    <>
      <div className=" py-3  cursor-pointer" onClick={() => handleItemClick(dispatchData)}>
        <div
          className="flex justify-center items-center"
          style={{ background: bgColor }}
        >
          <Image
            src={image}
            height={170}
            width={170}
            className={"!w-full !h-[230px] bg-transparent object-cover"}
            alt="image"
            unoptimized
          />

        </div>
      </div>
      <div className=" mt-2 bg-[#007042] flex flex-col py-2 justify-center items-center  rounded-lg cursor-pointer" onClick={() => handleItemClick(dispatchData)}>
        <h4 className="text-white text-lg font-bold text-center  font-inter">
          {mainHeading ? mainHeading : "No Discount"}
        </h4>
        <p className="items-start text-white xl:text-xs text-[15px] font-medium  font-inter">
          {subHeading && subHeading}
        </p>
      </div>
    </>
  );
};

export default VerticalBelowSpaceCard;
