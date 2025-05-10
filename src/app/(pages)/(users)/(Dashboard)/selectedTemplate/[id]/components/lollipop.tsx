import Image from 'next/image'
import React from 'react' 
import lollipop from "@/assets/images/activePop.png"
const Lollipop = () => {
  return (
    <>
      
      <Image
            height={42}
            width={30 } 
            alt="image" 
            src={lollipop}
            sizes="(max-width: 768px) 41px, (max-width: 1200px) 42px, 33px"
            // unoptimized
          />
      
 
  </>
  )
}

export default Lollipop