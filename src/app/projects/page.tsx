'use client';

import ProjectsGrid from '@/components/projects/ProjectsGrid';
import { useEffect } from 'react';
import AOS from 'aos';
import "aos/dist/aos.css";

export default function ProjectsPage() {
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
    <section className="w-full min-h-screen py-20 px-4 bg-white">
      <div className="mx-auto max-w-7xl text-center">
        <h2 
          className="text-2xl md:text-3xl font-bold mb-6" 
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Explore Opportunities
        </h2>
        <p 
          className="max-w-2xl mx-auto mb-10"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Welcome to the heart of Renovest UA — the Projects Hub.
          Here you can discover verified opportunities to make a real impact while building a strong investment
          portfolio.
        </p>
        <div 
          className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-2 max-w-35 mb-14 mx-auto"
          data-aos="fade-left"
          data-aos-delay="500"
        />

        {/* Project Grid with fade-in animation */}
        <div data-aos="fade-up" data-aos-delay="700">
          <ProjectsGrid/>
        </div>
      </div>
    </section>
  );
}