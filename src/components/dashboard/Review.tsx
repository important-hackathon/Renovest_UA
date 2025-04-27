import Image from "next/image";
import React from "react";

interface ReviewProps {
  investor: string;
  comment: string;
}

const Review = ({ investor, comment }: ReviewProps) => {
  return (
    <div className="flex items-start gap-5 sm:gap-10">
      <Image
        src="/assets/images/reviewIcon.svg"
        alt="User icon"
        width={40}
        height={40}
      />
      <div className="text-white ">
        <h3 className="font-bold text-lg sm:text-xl">Investor, {investor}</h3>
        <p className="text-base sm:text-lg">{comment}</p>
      </div>
    </div>
  );
};

export default Review;
