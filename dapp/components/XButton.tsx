import React from 'react';

interface CustomButtonProps {
    btnType: "button" | "submit" | "reset";
    title: string;
    handleClick?: () => void; // Make handleClick optional
    styles?: string;
}

const XButton: React.FC<CustomButtonProps> = ({ btnType, title, handleClick, styles }) => {
    return (
        <button
            type={btnType}
            className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
            onClick={handleClick}
        >
            {title}
        </button>
    );
}

export default XButton;