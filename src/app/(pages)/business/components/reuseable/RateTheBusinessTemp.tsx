import React from 'react'
import Lollipop from '../../../business/components/lollipop'
import Inactivepop from '../../../business/components/lollipopInactive'

const RateTheBusinessTemp = () => {
  return (
    <>
    <div  className='grid grid-cols-12 '>
         
           <div className="md:col-span-4 sm:col-span-6 col-span-12   flex flex-col justify-center">
            <p className="text-black text-lg font-medium font-inter flex justify-center items-center py-2">
              Ambience
            </p>
            <div className="flex justify-center items-center">
              <div className="flex ">
                <Lollipop /> <Lollipop /> <Lollipop /> <Lollipop /> 
                <Inactivepop />
              </div>
            </div>
          </div>
          {/* 3 */}
          <div className="md:col-span-4 sm:col-span-6 col-span-12  flex flex-col justify-center">
            <p className="text-black text-lg font-medium font-inter flex justify-center items-center py-2">
              Quality
            </p>
            <div className="flex justify-center items-center">
              <div className="flex ">
                <Lollipop /> <Lollipop /> <Lollipop /> <Lollipop /> 
                <Inactivepop />
              </div> 
            </div>
          </div>
          {/* 4 */}
          <div className="md:col-span-4 sm:col-span-6 col-span-12 flex flex-col justify-center">
            <p className="text-black text-lg font-medium font-inter flex justify-center items-center py-2">
              Service
            </p>
            <div className="flex justify-center items-center">
              <div className="flex ">
                <Lollipop /> <Lollipop /> <Lollipop /> <Lollipop /> 
                <Inactivepop />
              </div>  
            </div>
          </div>
    </div>
    
    </>
  )
}

export default RateTheBusinessTemp