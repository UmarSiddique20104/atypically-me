import { saveDealData } from "@/app/redux/dealsSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
const Verticle = ({ mainHeading, subHeading, image, title, bgColor, dispatchData }: any) => {
  const router = useRouter()
  const dispatch = useDispatch();
  const handleItemClick = (dealData: any) => {
    dispatch(saveDealData(dealData));
    router.push("/business/edit-deal");
  };

  return (
    <>
      <div className="w-full cursor-pointer" onClick={() => handleItemClick(dispatchData)}>
        <div className={`w-full rounded-xl`} style={{ background: bgColor }}>
          <div className="w-full  py-4 bg-[#007042] rounded-tl-xl rounded-tr-xl flex flex-col justify-center items-center">
            <h3 className="text-white text-xl font-bold  font-inter">
              {mainHeading ? mainHeading : "No Discount"}
            </h3>
            <h4 className="text-white text-xs  font-normal  font-inter">
              {subHeading && subHeading}

            </h4>
          </div>

          <div className="flex !h-[200px] !w-full  justify-center items-center">
            <Image
              src={image}
              height={125}
              width={700}
              // className="max-sm:w-full max-sm:h-[128px]  max-md:h-[160.606px] max-lg:h-[215px] max-xl:h-[215px] max-2xl:w-[215px] max-2xl:h-[210px] h-[210px] w-[100%] rounded-b-[8.741px]"
              className={"!h-[200px] !w-full bg-transparent rounded-b-[9px] object-cover"}
              alt="image"
              unoptimized
            />

          </div>

        </div>
        <div className="w-full">

          <div className='flex justify-center items-center'>
            <p className="text-black text-xs font-bold font-inter py-5" >{title}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verticle;
