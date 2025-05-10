import React from 'react'
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { saveDealData } from '@/app/redux/dealsSlice';
const ButtomDiscountCard = ({ mainHeading, subHeading, image, bgColor, dispatchData }: any) => {
  const router = useRouter()
  const dispatch = useDispatch();
  const handleItemClick = (dealData: any) => {
    dispatch(saveDealData(dealData));
    router.push("/business/edit-deal");
  };
  return (
    <>
      <div className='w-full  px-3 cursor-pointer' onClick={() => handleItemClick(dispatchData)}>
        <div className=' '>
          <div className="flex  justify-center items-center !h-[200px] !w-full" style={{ background: bgColor }}>
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
        <div className='  bg-[#007042] flex justify-center items-center'>
          <div className='py-2 text-center'>

            <h4 className="text-white 2xl:text-lg xl:text-xl lg:text-lg font-bold  font-inter">
              {mainHeading ? mainHeading : "No Discount"}


            </h4>
            <p className="items-start text-white text-[10px]  font-medium  font-inter">{subHeading ? subHeading : ""}</p>
          </div>
        </div>

      </div>
    </>
  )
}

export default ButtomDiscountCard