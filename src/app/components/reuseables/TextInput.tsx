'use client'
import React, { useState } from 'react';
import ShowIcon from './Svgs/ShowIcon';
import HideIcon from './Svgs/HideIcon';
import '../../globals.css'
interface TextInputProps {
    placeholder: string;
    type: string;
    name: string;
}

const TextInput: React.FC<TextInputProps> = ({ placeholder, type, name }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='sm:pt-[46px] pt-[30px] relative'>
            <input
                className="px-[10px] py-[10px] text-center rounded-[48px] w-[90vw] 
                sm:w-[640px] font-montserrat font-[800]
                leading-normal text-[17.101px] placeholder-[#000]" required
                placeholder={placeholder}
                type={showPassword ? 'text' : type}
                name={name}
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

export default TextInput;
