import React from 'react'
import Image from "next/image";
import { saveDealData } from '@/app/redux/dealsSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';


const HorizontalDiscountCard = ({ mainHeading, subHeading, image, bgColor, dispatchData }: any) => {
  const router = useRouter()
  const dispatch = useDispatch();
  const handleItemClick = (dealData: any) => {
    dispatch(saveDealData(dealData));
    router.push("/business/edit-deal");
  };
  return (
    <>
      <div className='sm:grid grid-cols-12   cursor-pointer' onClick={() => handleItemClick(dispatchData)}>
        <div className='col-span-4'>
          <div className="flex  justify-center items-center " style={{ background: bgColor }}>
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
        <div className='col-span-8 bg-[#007042] max-sm:h-[100px] flex justify-center items-center'>
          <div>

            <h4 className="text-white sm:text-2xl text-xl font-bold  font-inter">{mainHeading ? mainHeading : "No Discount"}</h4>
            <p className="items-start text-white text-[15px] font-medium  font-inter">{subHeading && subHeading}</p>
          </div>
        </div>

      </div>


    </>
  )
}

export default HorizontalDiscountCard