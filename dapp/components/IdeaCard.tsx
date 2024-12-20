import React, { useState, useEffect } from 'react';

interface IdeaCardProps {
    title: string;
    description: string;
    image: string;
    handleClick: () => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
   title,
   description,
   image,
   handleClick
}) => {
    const defaultImg = "http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg";
    const [imgPath, setImgPath] = useState(image);

    useEffect(() => {
        const img = new Image();
        img.src = image;
        img.onload = () => setImgPath(image);
        img.onerror = () => setImgPath(defaultImg);
    }, [image]);

    return (
        <div className="sm:w-[288px] w-full rounded-lg bg-[#1c1c24] shadow-lg cursor-pointer transition-transform transform hover:scale-105" onClick={handleClick}>
            <img src={imgPath} alt={title} className="w-full h-[158px] object-cover rounded-t-lg"/>
            <div className="flex flex-col p-4">
                <h3 className="font-epilogue font-semibold text-lg text-white leading-6 truncate">{title}</h3>
                <p className="mt-2 font-epilogue font-normal text-gray-200 leading-5 truncate">{description}</p>
            </div>
        </div>
    );
}

export default IdeaCard;