import React from "react";
import Lollipop from "../../business/components/lollipop";
// interfac {
//   ambienceAvg: string,
//   qualityAvg: string,
//   serviceAvg: string,

// }

const Reviews = ({ data, count }: any) => {
  return (
    <>
      <div className="grid grid-cols-12 ">
        <div className="md:col-span-4 sm:col-span-6 col-span-12 flex flex-col justify-center">
          <p className="text-black text-[15px] font-normal font-inter flex justify-center items-center py-2">
            Ambience
          </p>
          <div className="flex justify-center items-center">
            <div className="flex gap-2 items-center">

              <Lollipop />
              <span className="text-black text-2xl font-bold  font-inter">
                {data?.ambienceAvg}/5
              </span>
              <span className="text-black text-2xl font-light  font-inter">
                ({count?.totalAmbience})

              </span>
              <span className="text-black text-2xl font-bold  font-inter">

              </span>
            </div>
          </div>
        </div>
        {/* 3 */}
        <div className="md:col-span-4 sm:col-span-6 col-span-12 flex flex-col justify-center">
          <p className="text-black text-[15px] font-normal font-inter flex justify-center items-center py-2">
            Quality
          </p>
          <div className="flex justify-center items-center">
            <div className="flex gap-2 items-center">

              <Lollipop />
              <span className="text-black text-2xl font-bold  font-inter">
                {data?.qualityAvg}/5
              </span>
              <span className="text-black text-2xl font-light  font-inter">
                ({count?.totalQuality})
              </span>
              <span className="text-black text-2xl font-bold  font-inter">

              </span>
            </div>
          </div>
        </div>
        {/* 4 */}
        <div className="md:col-span-4 sm:col-span-6 col-span-12 flex flex-col justify-center">
          <p className="text-black text-[15px] font-normal font-inter flex justify-center items-center py-2">
            Service
          </p>
          <div className="flex justify-center items-center">
            <div className="flex gap-2">

              <Lollipop />
              <span className="text-black text-2xl font-bold  font-inter">
                {data?.serviceAvg}/5
              </span>
              <span className="text-black text-2xl font-light  font-inter">
                ({count?.totalService})
              </span>
              <span className="text-black text-2xl font-bold  font-inter">

              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reviews;
