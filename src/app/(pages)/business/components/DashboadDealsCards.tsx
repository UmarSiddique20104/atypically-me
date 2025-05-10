import Image from "next/image";
import React from "react";
const DashboadDealsCards = ({ mainHeading, subHeading, image, title, bgColor }: any) => {

    return (
        <>
            <div className="w-[271.504px] max-sm:w-[240.504px]  h-[287.474px]">

                <div className={`rounded-[9px]`} style={{ background: bgColor }}>
                    <div className="py-2 bg-[#007042] rounded-tl-xl rounded-tr-xl flex flex-col justify-center items-center">
                        <h3 className="font-montserrat text-[28px] text-center mx-1 text-white font-bold leading-normal">
                            {mainHeading ? mainHeading : "No Discount"}
                        </h3>
                        <h4 className="text-white text-sm  font-normal  font-inter">
                            {subHeading}
                        </h4>
                    </div>

                    <div className="">
                        <Image
                            src={image}
                            height={287}
                            width={271}
                            // className="max-sm:w-full max-sm:h-[128px]  max-md:h-[160.606px] max-lg:h-[215px] max-xl:h-[215px] max-2xl:w-[215px] max-2xl:h-[210px] h-[210px] w-[100%] rounded-b-[8.741px]"
                            className={"!h-[287px] !w-[281px] bg-transparent rounded-b-[9px] object-cover"}
                            unoptimized
                            alt="image"
                        />

                    </div>

                </div>
                <div className="">
                    <p className="text-center font-montserrat text-sm font-bold leading-normal pt-[18.39px]">
                        {title}
                    </p>
                </div>



            </div>
        </>
    );
};

export default DashboadDealsCards;
