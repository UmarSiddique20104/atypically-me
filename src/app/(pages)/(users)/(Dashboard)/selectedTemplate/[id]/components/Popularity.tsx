import React from 'react'
import Lollipop from './lollipop'

const Popularity = ({reviews}:any) => {
  return (
    < > 
  
    <div className='flex justify-center  items-center  gap-5 '>
        
    <div className='  md:flex block md:justify-around justify-center items-center py-10 gap-5'>
    <p className="text-black text-base flex font-bold  font-inter justify-center items-center px-4 pt-2">Popularity</p>
    <h4 className="text-black text-[83px] font-normal flex justify-center  font-varela">{reviews?.length}</h4>
    <div className='flex justify-center md:px-4'>

    <Lollipop/>
    <Lollipop/>
    <Lollipop/>
    <Lollipop/>
    <Lollipop/>
    </div>
    <p className='text-black text-[15px] font-normal flex justify-center  font-varela'>Lollipops </p>
    
    
    </div>
  </div>
  
    
    </>
  )
}

export default Popularity