'use client';

import { useEffect } from "react";

interface OfferCardProps {
  title: string;
  description: string;
  imageSrc: string;
  delay?: number;
}

const OfferCard = ({ title, description, imageSrc, delay = 0 }: OfferCardProps) => {
  return (
    <div
      className="rounded-4xl py-6 px-5 flex flex-col transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 overflow-hidden relative group cursor-pointer"
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Dark overlay that appears on hover */}
      <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-[#C6FF80] mb-40 group-hover:scale-105 transition-transform duration-300">
          {title}
        </h3>
        <p className="text-xl text-white mt-auto transform group-hover:translate-y-[-5px] transition-transform duration-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default OfferCard;