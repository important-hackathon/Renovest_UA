import React from "react";
import Card from "./Card";
import { cards } from "./cards";

const WhyChooseUs = () => {
  return (
    <div className="bg-white py-20 bg-[url('/assets/images/why-renovate-bg.svg')] bg-cover bg-center no-repeat">
      <div className="max-w-5xl mx-auto px-5 box-border">
        <h1 className="text-center font-bold text-[26px] md:text-[30px] lg:text-[32px] mb-12.5">
          Why Renovest UA?
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {cards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
              borderColor={card.borderColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
