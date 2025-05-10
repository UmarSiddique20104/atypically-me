import Image from 'next/image'
import React from 'react' 
import lollipop from "@/assets/images/activePop.png"
const Lollipop = () => {
  return (
    <span>
      
      <Image
            height={30}
            width={30 } 
            alt="image" 
            src={lollipop}
            sizes="(max-width: 768px) 30px, (max-width: 1200px) 30px, 33px"
          />
      
 
  </span>
  )
}

export default Lollipop