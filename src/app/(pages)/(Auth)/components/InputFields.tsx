""
import React, { useState } from 'react';
import ShowIcon from '../../../components/reuseables/Svgs/ShowIcon';
import HideIcon from '../../../components/reuseables/Svgs/HideIcon';

interface InputFields {
    placeholder: string;
    type: string;
    name: string;
    value: any;
    onChange: any;
    onBlur: any
}

const InputFields = ({ placeholder, type, name, value, onChange, onBlur, title }: any) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='pt-[20px] flex flex-col   relative'>
            <label className="font-montserrat text-[17.5px] pl-2 leading-normal font-[700] py-2" htmlFor="">{title}</label>
            <input
                className="px-[10px] py-[10px]  text-center rounded-[48px] w-[90vw] 
                sm:w-[640px] font-montserrat placeholder:font-[700] font-normal
                leading-normal text-[17.101px] placeholder-[#000]"
                placeholder={placeholder}
                type={showPassword ? 'text' : type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            />
            {type === 'password' && (
                <div
                    className="absolute bottom-3 right-5 w-fit h-[20px] cursor-pointer"
                    onClick={togglePasswordVisibility}
                > {showPassword ? <ShowIcon /> : <HideIcon />}
                </div>
            )}
        </div>
    );
}

export default InputFields;
















// InputFields