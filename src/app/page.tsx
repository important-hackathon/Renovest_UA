'use client';

import { useEffect } from "react";
import AboutUs from "@/components/home/AboutUs";
import JoinMovement from "@/components/home/JoinMovement";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import OurOffers from "@/components/home/OurOffers";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
    
    // Custom animation for width growth
    AOS.refresh();
    document.querySelectorAll('[data-aos="width"]').forEach(element => {
      element.setAttribute('data-aos', 'fade-right');
      (element as HTMLElement).style.width = '0';
      
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              (element as HTMLElement).style.transition = 'width 1s ease-out';
              (element as HTMLElement).style.width = ''; // Reset to CSS value
            }, parseInt(element.getAttribute('data-aos-delay') || '0'));
            observer.disconnect();
          }
        });
      });
      
      observer.observe(element);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <AboutUs />
      <OurOffers />
      <WhyChooseUs />
      <JoinMovement />
    </div>
  );
}