'use client'
import React, { useState } from 'react';
import ShowIcon from './Svgs/ShowIcon';
import HideIcon from './Svgs/HideIcon';
import '../../globals.css'
interface TextInputProps {
    placeholder: string;
    type: string;
    name: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChangeTextInput: React.FC<TextInputProps> = ({ placeholder, type, name ,onChange}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='sm:pt-[46px] max-sm:pt-7 pt-[30px] relative  '>
            <input
                className="px-[10px] py-[10px]  text-center rounded-[48px] w-[90svw] 
                max-sm:w-[100%] max-md:w-[84svw] max-lg:w-[82svw] max-xl:w-[70svw] max-2xl:w-[60svw] 2xl:w-[60svw] font-montserrat font-[800]
                leading-normal text-[17.101px] placeholder-[#000]  lg:mx-[110px] xl:mx-[230px] 2xl:mx-[280px]" required
                placeholder={placeholder}
                type={showPassword ? 'text' : type}
                name={name}
                onChange={onChange}

            />
            {type === 'password' && (
                <button
                    className="absolute sm:inset-y-[60px] inset-y-[45px]  right-[25px] w-[20px] h-[20px] cursor-pointer"
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? <ShowIcon /> : <HideIcon />}
                </button>
            )}
        </div>
    );
}

export default ChangeTextInput;
