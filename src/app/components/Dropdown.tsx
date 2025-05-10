"use client"
import { useEffect, useRef, useState } from "react";

const Dropdown = ({
  options,
  handleClick,
  active,
  color,
  twClass,
  defaultValue,
  label,
  width,
}: {
  options: string[];
  handleClick: any;
  active: string | undefined;
  color?: string;
  twClass?: string;
  defaultValue?: string;
  label?: string;
  width?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    active
  );

  const handleSelect = (selectedValue: string) => {
    setSelectedValue(selectedValue);
    handleClick(selectedValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative inline-block text-left z-50 pt-[11px]"
      ref={dropdownRef}
    >
      <label className="pb-[15px] pt-[11px] font-montserrat font-bold text-start text-[17.101px]">
        {label}
      </label>
      <div
        className={`${width} text-start rounded-[48px] w-[90vw] sm:w-[640px] font-montserrat font-[400] leading-normal text-[17.101px] placeholder-[#000]`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className={`px-[73px] py-[10px] flex items-center justify-between rounded-[48px] w-[90vw] sm:w-[640px] font-montserrat font-[400] leading-normal bg-[#ffffff] text-[17.101px] placeholder-[#000] ${width}`}
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        >
          <div>{selectedValue || (!active && defaultValue)}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="11"
            viewBox="0 0 12 11"
            fill="none"
          >
            <path
              d="M6.23738 10.1289L0.474761 0.14776L12 0.147759L6.23738 10.1289Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div
          className={`filters-dropdown origin-top-left mt-[-43px] z-50 absolute max-h-80 overflow-auto w-full ${twClass ? twClass : "left-0 "
            }  w-full gap-[2px] rounded-[12.098px] shadow-lg  bg-${color} ring-[1.21px] ring-black focus:outline-none`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1 bg-[#ffffff] px-3" role="none">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className="block px-4 rounded-[48.393px] py-2 text-[17px] text-[#000]  font-[400] w-full bg-[#ffffff] hover:[#f5f5f5] hover:text-gray-900 hover:bg-[#FCC2A0] capitalize text-left"
                role="menuitem"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
