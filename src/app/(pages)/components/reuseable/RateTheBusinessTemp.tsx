import React from 'react';
import Lollipop from '../../business/components/lollipop';
import Inactivepop from '../../business/components/lollipopInactive';

const RateTheBusinessTemp = ({ data, count }: any) => {

  const renderLollipops = (rating: number) => {
    const activeLollipops = Array.from({ length: rating }, (_, index) => (
      <Lollipop key={`active-${index}`} />
    ));
    const inactiveLollipops = Array.from({ length: 5 - rating }, (_, index) => (
      <Inactivepop key={`inactive-${index}`} />
    ));
    return [...activeLollipops, ...inactiveLollipops];
  };

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="md:col-span-4 sm:col-span-6 col-span-12 flex flex-col justify-center">
          <p className="text-black text-lg font-medium font-inter flex justify-center items-center py-2">
            Ambience
          </p>
          <div className="flex justify-center items-center">
            <div className="flex">
              {renderLollipops(data?.ambienceAvg)}
            </div>
          </div>
        </div>
        {/* 3 */}
        <div className="md:col-span-4 sm:col-span-6 col-span-12 flex flex-col justify-center">
          <p className="text-black text-lg font-medium font-inter flex justify-center items-center py-2">
            Quality
          </p>
          <div className="flex justify-center items-center">
            <div className="flex">
              {renderLollipops(data?.qualityAvg)}
            </div>
          </div>
        </div>
        {/* 4 */}
        <div className="md:col-span-4 sm:col-span-6 col-span-12 flex flex-col justify-center">
          <p className="text-black text-lg font-medium font-inter flex justify-center items-center py-2">
            Service
          </p>
          <div className="flex justify-center items-center">
            <div className="flex">
              {renderLollipops(data?.serviceAvg)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RateTheBusinessTemp;
