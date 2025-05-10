import React from 'react';

interface Props {
  title: string;
  emphasizedText: string;
  restOfText: string;
  restOfText2: string;
  lineBreak?: boolean;
}

const CustomHeadingV2: React.FC<Props> = ({ title, emphasizedText, restOfText, restOfText2, lineBreak = false }) => {
  return (
    <h1 className='font-montserrat font-[400] max-sm:text-[25px] md:text-[45px] text-[35px] text-center pt-[10px]'>
      {title} <span className="font-[700]">{emphasizedText}</span>{lineBreak && restOfText && <br />} {restOfText ? restOfText : restOfText2}

    </h1>
  );
};

export default CustomHeadingV2;
