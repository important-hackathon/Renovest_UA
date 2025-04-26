'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import AOS from "aos";
import "aos/dist/aos.css";
import supabase from "@/lib/supabaseClient";

const AboutUs = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true
    });

    // Check if user is logged in
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <div className="min-h-[100vh] flex flex-col justify-end">
      <div className="w-full min-h-[80vh] bg-[url('/assets/images/about-us-background.svg')] bg-cover bg-center no-repeat relative">
        <div className="max-w-7xl mx-auto px-5 box-border">
          <div 
            className="max-w-[600px]"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <h1 className="text-[#000000] text-[32px] sm:text-[48px] font-bold mb-3.5">
              Renovest UA
            </h1>

            <div 
              className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-[8px] max-w-[150px] mb-5"
              data-aos="width"
              data-aos-delay="300"
            />

            <p 
              className="text-[16px] sm:text-[18px] mb-6"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Is an online platform that connects international investors with
              post-war reconstruction projects across Ukraine. We are building a
              transparent and secure ecosystem for investing in infrastructure
              recovery, startup support, real estate development, and innovative
              initiatives.
            </p>

            <Marquee
              direction="right"
              speed={40}
              gradient={false}
              autoFill={true}
            >
              <p className="text-base md:text-xl font-bold text-black">
                bonds - startups - stocks - crowdfunding - 
              </p>
            </Marquee>

            <div 
              className="flex gap-5 items-center mt-8"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              {isLoading ? (
                <div className="h-[44px] w-[120px] bg-gray-300 animate-pulse rounded-full"></div>
              ) : user ? (
                <Link 
                  href="/dashboard" 
                  className="text-[18px] text-white lg:text-2xl font-bold py-2.5 px-4 lg:px-8 bg-[#0088FF] rounded-full hover:bg-[#0077ee] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  href="/auth/register" 
                  className="text-[18px] text-white lg:text-2xl font-bold py-2.5 px-4 lg:px-8 bg-[#0088FF] rounded-full hover:bg-[#0077ee] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              )}
              
              <Link 
                href="/projects"

                className="text-[18px] lg:text-2xl font-bold py-2.5 px-4 lg:px-8 bg-[#C6FF80] text-black rounded-full hover:bg-[#b5ff60] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
        <img
          className="absolute right-30 top-0 h-full hidden lg:block"
          src="/assets/images/building.svg"
          alt="Building image"
          data-aos="fade-left"
          data-aos-delay="700"
        />
      </div>
    </div>
  );
};

export default AboutUs;