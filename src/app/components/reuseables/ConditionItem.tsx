import React from 'react';

interface Condition {
    name: JSX.Element;
    color: string;
    icon: JSX.Element;
    selected: boolean;
}

interface ConditionItemProps {
    condition: Condition;
    onClick: () => void;
}

const ConditionItem = ({ condition, onClick }: ConditionItemProps) => {
    return (
        <div
            className={`condition rounded-lg text-center flex flex-col items-center ${condition.selected ? 'border-3 border-black' : ''}`}
            onClick={onClick}
        >
            <div className={`${condition.color} rounded-[21.277px] w-[115.957px] h-[115.957px] flex justify-center items-center`}>
                {condition.icon}
            </div>
            <div className="condition-name pt-[9px]">
                <p className="font-montserrat font-[700] leading-[1.3rem] text-black text-[14.894px] text-center">{condition.name}</p>
            </div>
        </div>
    );
};

export default ConditionItem;