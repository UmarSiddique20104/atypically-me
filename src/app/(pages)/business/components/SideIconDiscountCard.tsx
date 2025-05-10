import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { saveDealData } from "@/app/redux/dealsSlice";
const SideIconDiscountCard = ({
  mainHeading,
  subHeading,
  image,
  bgColor,
  dispatchData
}: any) => {
  const router = useRouter()
  const dispatch = useDispatch();
  const handleItemClick = (dealData: any) => {
    dispatch(saveDealData(dealData));
    router.push("/business/edit-deal");
  };
  return (
    <>
      <div className="grid grid-cols-12  cursor-pointer " onClick={() => handleItemClick(dispatchData)}>
        <div className="col-span-12 relative">
          <div
            className="flex justify-center items-center my-2"
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

          <div className="absolute top-2 bg-[#007042] py-2 px-5  rounded-tr-xl  rounded-br-xl flex justify-center items-center">

            <p className="text-white text-sm font-bold  font-inter">
              {mainHeading ? mainHeading : 'No Discount'}

            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideIconDiscountCard;
