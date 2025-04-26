'use client';

import OfferCard from "./OfferCard";
import { useEffect } from "react";

const OurOffers = () => {
  return (
    <div className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-5 box-border">
        <h1 
          className="text-white text-[32px] font-bold mb-8"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          What We Offer?
        </h1>
        <div 
          className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-[8px] max-w-[150px] mb-8 lg:mb-15"
          data-aos="width"
          data-aos-delay="200"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <OfferCard
            title="Invest in Reconstruction Projects"
            description="Finance the rebuilding of roads, bridges, schools, and hospitals by purchasing bonds and other investment instruments."
            imageSrc="/assets/images/reconstruction.png"
            delay={300}
          />
          <OfferCard
            title="Support Startups"
            description="Invest in Ukrainian innovation. All startups are vetted through accredited accelerators working in partnership with Ukraine's Ministry of Digital Transformation."
            imageSrc="/assets/images/startups.svg"
            delay={400}
          />
          <OfferCard
            title="Direct Investment in National Development"
            description="From environmental initiatives to technology hubs – choose projects that align with your values and vision."
            imageSrc="/assets/images/national-development.svg"
            delay={500}
          />
          <OfferCard
            title="Real Estate and Crowdfunding Opportunities"
            description="Access carefully verified investment opportunities in real estate and collaborative projects."
            imageSrc="/assets/images/real-estate.svg"
            delay={600}
          />
        </div>
      </div>
    </div>
  );
};

export default OurOffers;