import Image from 'next/image';
import React from 'react';
import lollipop from "@/assets/images/inactivePop.png";

interface CustomInActivelolipop {
  height: number;
  width: number;
}

const CustomLollipop: React.FC<CustomInActivelolipop> = ({ height, width }) => {
  return (
    <span>
      <Image
        height={height}
        width={width}
        alt="image"
        src={lollipop}
      />
    </span>
  );
};

export default CustomLollipop;
