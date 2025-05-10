import React, { useState } from "react";
import ShowIcon from "./Svgs/ShowIcon";
import HideIcon from "./Svgs/HideIcon";

interface TextInputProps {
  type: string;
  name: string;
  label: string;
}

const TextInput: React.FC<TextInputProps> = ({ type, name, label }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="sm:pt-[46px] pt-[11px!Important] relative">
      <div className="flex flex-col ">
        <label className="pb-[15px] font-montserrat font-bold text-start text-[17.101px]">
          {label}
        </label>
       
        <input
          className="px-[73px] py-[10px] text-start rounded-[48px] w-[90vw] 
                sm:w-[640px] font-montserrat font-[400]
                leading-normal text-[17.101px] placeholder-[#000]"
          required
          type={showPassword ? "text" : type} // Conditionally show password
          name={name}
        />
      </div>
      {type === "password" && (
        <button
          className="absolute sm:inset-y-[64px] max-sm:inset-y-[64px] inset-y-[50px]  right-[25px] w-[20px] h-[20px] cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <ShowIcon /> : <HideIcon />}
        </button>
      )}
    </div>
  );
};

export default TextInput;
