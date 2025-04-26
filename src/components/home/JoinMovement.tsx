'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";

const JoinMovement = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    <div className="bg-[#000000]">
      <div className="max-w-7xl mx-auto px-5 box-border">
        <div className="py-15 md:py-30 flex justify-between items-center gap-10 flex-col lg:flex-row">
          <div 
            className="w-full sm:w-[60vw] lg:w-1/2"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <img src="/assets/images/join-today.svg" alt="Join illustration" />
          </div>

          <div 
            className="text-white w-full sm:w-[60vw] lg:w-1/2"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <div className="max-w-full lg:max-w-[400px] flex flex-col ml-auto">
              <h1 className="text-white font-bold text-[28px] lg:text-[32px] mb-3.5 lg:mb-5.5">
                Join the Movement Today
              </h1>

              <div 
                className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-[8px] w-[120px] mb-8 lg:mb-12"
                data-aos="width"
                data-aos-delay="600"
              />

              <p className="text-base lg:text-[18px] mb-10 lg:mb-15">
                Invest in something truly meaningful — the recovery, growth, and
                future of Ukraine.{" "}
                <span className="font-bold">Renovest UA</span> — Your Investment
                in a New Chapter for Ukraine.
              </p>

              <div 
                className="flex gap-4 items-center"
                data-aos="fade-up"
                data-aos-delay="800"
              >
                {isLoading ? (
                  <div className="h-[44px] w-[120px] bg-gray-700 animate-pulse rounded-full"></div>
                ) : user ? (
                  <Link 
                    href="/dashboard" 
                    className="text-[18px] lg:text-2xl font-bold py-2.5 px-4 lg:px-6.5 bg-[#0088FF] rounded-full hover:bg-[#0077ee] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/auth/register" 
                    className="text-[18px] lg:text-2xl font-bold py-2.5 px-4 lg:px-6.5 bg-[#0088FF] rounded-full hover:bg-[#0077ee] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Register
                  </Link>
                )}
                
                <Link 
                  href="/projects"
                  className="text-[18px] lg:text-2xl font-bold py-2.5 px-4 lg:px-2 bg-[#C6FF80] text-black rounded-full hover:bg-[#b5ff60] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Explore Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinMovement;