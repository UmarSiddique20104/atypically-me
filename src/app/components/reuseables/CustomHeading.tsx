import React from 'react';

interface Props {
    title: string;
    FontWeight: Number;

}

const CustomHeading: React.FC<Props> = ({ title, FontWeight }) => {
    return (
        <h1 className={`font-montserrat font-[${FontWeight}] leading-normal text-[45px] text-center pt-[10px]`}>
            {title}
        </h1>
    );
};

export default CustomHeading;
