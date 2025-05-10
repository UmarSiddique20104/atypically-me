import React from "react";
import empty from "@/assets/images/inactivePop.png"
import Image from "next/image";
const Inactivepop = () => {
  return (
    <div>
         <Image
            src={empty}
            height={30}
            width={30}
            className={'object-cover '}
            alt='image'
            sizes="(max-width: 768px) 50px, (max-width: 1200px) 50px, 33px"
         
            /> 
 
    </div>
  );
};

export default Inactivepop;
