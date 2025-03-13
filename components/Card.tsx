import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface CardProps {
  className: string;
  img: string;
  title: string;
  description: string;
  handleClick: () => void;
}

const Card = ({
  className,
  img,
  title,
  description,
  handleClick,
}: CardProps) => {
  return (
    <div>
      <div
        className={cn(
          "px-4 py-6 flex flex-col justify-between w-full xl:max-w-[370px] min-h-[260px] rounded-[14px] cursor-pointer",
          className
        )}
        onClick={handleClick}
      >
        <div className="flex items-center justify-center glassmorphism size-12 rounded-[10px]">
          <Image src={img} alt="image" width={22} height={22} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-extrabold">{title}</h1>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
