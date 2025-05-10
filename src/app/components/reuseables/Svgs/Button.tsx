import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
    return (
        <button
            className={`bg-black text-[17px] font-montserrat font-bold text-[#fff] py-[16px] px-[100px] rounded-[30px] ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
