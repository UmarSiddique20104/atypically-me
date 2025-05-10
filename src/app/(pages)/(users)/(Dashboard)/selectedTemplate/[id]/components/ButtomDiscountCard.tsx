import React from 'react'
import Image from "next/image";

interface ButtomDiscountCardProps {
  mainHeading: string;
  subHeading: string;
  image: string;
}

const ButtomDiscountCard: React.FC<ButtomDiscountCardProps> = ({ mainHeading, subHeading, image }) => {
  return (
    <div className=' w-[300px] py-3'>
      <div className='flex justify-center !w-72  !h-52 items-center'>
        <Image
          src={image}
          height={500}
          width={500}
          className="bg-transparent object-cover !h-full !w-full"
          alt="image"
          unoptimized
        />
      </div>
      <div className='bg-[#007042] flex justify-center !w-72  items-center h-24'>
        <div className='py-2 text-center'>
          <h4 className="text-white text-2xl font-bold font-inter">
            {mainHeading && mainHeading}


          </h4>
          <p className="text-white text-base font-medium font-inter">
            {subHeading ? subHeading : "No Discount"}

          </p>
        </div>
      </div>
    </div>
  )
}

export default ButtomDiscountCard;
