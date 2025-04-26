'use client';

import React, { useEffect } from "react";

const WhyChooseUs = () => {
  return (
    <div className="bg-white py-20 bg-[url('/assets/images/why-renovate-bg.svg')] bg-cover bg-center no-repeat">
      <div className="max-w-5xl mx-auto px-5 box-border">
        <h1 
          className="text-center font-bold text-[26px] md:text-[30px] lg:text-[32px] mb-12.5"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Why Renovest UA?
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          <div 
            className="border-3 border-[#C6FF80] rounded-4xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h3 className="md:text-[18px] lg:text-xl font-bold text-[#000000] mb-4">
              Complete Transparency
            </h3>
            <p className="md:text-[16px] lg:text-[18px] text-[#000000]">
              Track every project stage — from submission to completion — with
              detailed updates, reports, and financial forecasts.
            </p>
          </div>

          <div 
            className="border-3 border-[#0088FF] rounded-4xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <h3 className="md:text-[18px] lg:text-xl font-bold text-[#000000] mb-4">
              Direct Communication
            </h3>
            <p className="md:text-[16px] lg:text-[18px] text-[#000000]">
              Investors can communicate directly with project managers and
              government representatives through the platform.
            </p>
          </div>

          <div 
            className="border-3 border-[#0088FF] rounded-4xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <h3 className="md:text-[18px] lg:text-xl font-bold text-[#000000] mb-4">
              Security and Trust
            </h3>
            <p className="md:text-[16px] lg:text-[18px] text-[#000000]">
              Integrated with Ukraine's 'Diia' platform for secure user and
              project verification. All data is protected.
            </p>
          </div>

          <div 
            className="border-3 border-[#C6FF80] rounded-4xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <h3 className="md:text-[18px] lg:text-xl font-bold text-[#000000] mb-4">
              Real-Time Analytics
            </h3>
            <p className="md:text-[16px] lg:text-[18px] text-[#000000]">
              Access dynamic reporting and real-time analytics on investment
              performance and project progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;