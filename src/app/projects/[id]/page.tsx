"use client";

import React, { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { MoveLeft } from "lucide-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Carousel from "@/components/ui/Carousel";
import Image from "next/image";
import { SwiperSlide } from "swiper/react";
import { stages } from "./stages";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        console.error("Project ID is undefined");
        setError("Project ID is missing");
        setLoading(false);
        return;
      }

      console.log("Fetching project with ID:", projectId);
      setLoading(true);

      try {
        // Fetch user data
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error fetching user:", userError);
        } else {
          setUserData(user);
        }

        // First, let's check if the project exists
        const { data: checkData, error: checkError } = await supabase
          .from("projects")
          .select("id")
          .eq("id", projectId)
          .single();

        if (checkError) {
          console.error("Error checking project existence:", checkError);
          if (checkError.code === "PGRST116") {
            setError("Project not found");
            setLoading(false);
            return;
          }
        }

        console.log("Project exists check:", checkData);

        // Fetch project data with full details
        const { data, error: fetchError } = await supabase
          .from("projects")
          .select(
            `
            id,
            title,
            description,
            investment_goal,
            investment_received,
            image_url,
            created_at,
            status,
            owner_id
          `
          )
          .eq("id", projectId)
          .single();

        if (fetchError) {
          console.error("Error fetching project details:", fetchError);
          setError(`Failed to load project: ${fetchError.message}`);
          setLoading(false);
          return;
        }

        console.log("Project data:", data);

        // If we have project data, fetch the owner details
        if (data) {
          // Separate query for owner to simplify
          const { data: ownerData, error: ownerError } = await supabase
            .from("users")
            .select(
              `
              id,
              email,
              phone
            `
            )
            .eq("id", data.owner_id)
            .single();

          if (ownerError) {
            console.error("Error fetching owner details:", ownerError);
          } else {
            console.log("Owner data:", ownerData);
            // Combine project with owner data
            setProject({
              ...data,
              owner: ownerData,
            });
          }
        } else {
          setProject(data);
        }
      } catch (err) {
        console.error("Unexpected error during fetch:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="animate-pulse flex flex-col gap-4 w-full max-w-3xl">
          <div className="bg-gray-200 h-64 w-full rounded-lg"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 p-8 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Error Loading Project
          </h2>
          <p className="text-gray-700">{error}</p>
          <p className="mt-6">Project ID: {projectId}</p>
          <a
            href="/projects"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Return to Projects
          </a>
        </div>
      </div>
    );
  }

  if (!project) {
    return notFound(); // return 404 if no project found
  }

  const percent = Math.min(
    Math.round(
      (Number(project.investment_received) / Number(project.investment_goal)) *
        100
    ),
    100
  );

  // Check if current user is the owner
  const isOwner = userData?.id === project.owner?.id;

  // Format date
  const formattedDate = new Date(project.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Remove later (just for test)
  const images: string[] = [
    "/assets/temp/slider1.jpg",
    "/assets/temp/slider2.jpg",
    "/assets/temp/slider3.jpg",
    "/assets/temp/slider4.jpg",
  ];

  return (
    <>
      <section className="min-h-screen bg-white text-black py-12 mt-10">
        <div className="max-w-7xl mx-auto px-5 box-border">
          <div className="mb-5">
            <button
              onClick={() => router.back()}
              className="rounded-full bg-[#C6FF80] cursor-pointer px-3 py-1.5 flex items-center gap-2 text-base md:text-xl font-semibold hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <MoveLeft />
              <span className="text-black">Назад</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full h-full pb-120 md:pb-90 lg:pb-35 border-b-3 border-[#D7DDE7] items-start">
            {/*Slider*/}

            {images.length !== 0 && (
              <div className="w-full h-full order-2 md:order-first pb:15 md:pb-20 lg:pb-50">
                <div className="max-h-110 lg:max-h-130 h-full relative rounded-3xl overflow-hidden shadow-md">
                  <Carousel
                    leftButton={
                      <div className="absolute top-1/2 left-5 transform -translate-y-1/2 z-10">
                        <button className="cursor-pointer">
                          <ArrowLeft size={40} color="#fff" />
                        </button>
                      </div>
                    }
                    rightButton={
                      <div className="absolute top-1/2 right-5 transform -translate-y-1/2 z-10">
                        <button className="cursor-pointer">
                          <ArrowRight size={40} color="#fff" />
                        </button>
                      </div>
                    }
                  >
                    {images.map((img, index) => (
                      <SwiperSlide
                        className="rounded-3xl overflow-hidden"
                        key={index}
                      >
                        <Image
                          src={img}
                          alt="Animal image"
                          layout="fill"
                          objectFit="cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Carousel>
                </div>

                <div className="mt-6 mb-10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {images
                      .reverse()
                      .slice(0, 4)
                      .map((img, index) => (
                        <div className="rounded-xl overflow-hidden" key={index}>
                          <img
                            src={img}
                            alt="Animal"
                            className="aspect-square object-cover w-full h-full"
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {/*Owner*/}
                <div className="">
                  <div className="text-lg">
                    <p>Owner:</p>
                    <p className="font-bold">
                      Mykhailo Montimovich Mykolaivich
                    </p>
                  </div>

                  {/*Contacts*/}
                  <div className="text-lg mb-7">
                    <p>Contacts:</p>
                    <p className="font-bold">+380980123456</p>
                  </div>
                </div>
              </div>
            )}

            {/*Info*/}
            <div className="order-1 md:order-last relative text-[#432907]">
              <div className="mb-5">
                <h1 className="font-bold text-2xl mb-5">
                  Bond for the restoration of the M-30 highway (Lviv - Odesa)
                </h1>

                <div className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-[8px] max-w-[150px] mb-5" />

                <p className="">
                  This bond finances the restoration and modernization of the
                  M-30 highway, a strategic transport corridor connecting Lviv
                  and Odesa. The project aims to repair war-damaged sections,
                  expand traffic capacity, and improve safety standards,
                  enhancing both national logistics and international trade
                  routes.
                </p>
              </div>

              {/*Bond details*/}
              <div className="mb-5">
                <h2 className="font-bold text-xl mb-2">Bond details</h2>
                <ul className="list-disc pl-7">
                  <li>Type: Government Infrastructure Bond</li>
                  <li>Investment Term: 5 years</li>
                  <li>Expected Return: 7% annually</li>
                  <li>Currency: USD or EUR</li>
                  <li>Minimum Investment: $500</li>
                  <li>
                    Guarantee: Secured by the Government of Ukraine, under
                    international reconstruction agreements
                  </li>
                </ul>
              </div>

              {/*Project verification*/}
              <div className="mb-8">
                <h2 className="font-bold text-xl mb-2">Project Verification</h2>
                <ul className="list-disc pl-7">
                  <li>
                    Officially approved by the Ministry of Infrastructure of
                    Ukraine
                  </li>
                  <li>Independently audited by Diia</li>
                  <li>
                    Full transparency through Renovest UA platform reporting
                  </li>
                </ul>
              </div>

              <div className="flex gap-5 flex-wrap">
                <button className="bg-[#C6FF80] px-6 py-2 text-black rounded-full font-bold text-base md:text-lg cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">
                  View reports
                </button>
                <button className="bg-[#0088FF] px-6 py-2 text-white rounded-full font-bold text-base md:text-lg cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">
                  Invest now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-black py-12">
        <div className="max-w-5xl mx-auto px-5 box-border">
          <div className="flex justify-center mb-10">
            <h2 className="font-bold text-lg md:text-2xl text-white max-w-[350px] text-center">
              Construction Stages and Funding Allocation
            </h2>
          </div>

          <div className="flex flex-col gap-9">
            {stages.map((stg, index) => (
              <div
                key={index}
                className="border-2 border-[#C6FF80] rounded-3xl px-6 md:px-9.5 py-6 text-white"
              >
                <h3 className="font-bold text-base md:text-xl mb-3">
                  Stage {index + 1}: {stg.stage}
                </h3>

                <ul className="list-disc pl-5 text-sm md:text-base">
                  <li>Timeline: {stg.timeline}</li>
                  <li>Funding Needed: {stg.fundingNeeded}</li>
                  <li>{stg.scope}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="bg-white pt-10 pb-2 px-5">
        <div className="flex justify-center mb-20">
          <button className="bg-[#0088FF] text-white px-6 md:px-12 py-2.5 font-bold text-lg md:text-2xl rounded-full hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
            Invest in this project
          </button>
        </div>

        <div className="max-w-[700px] mx-auto bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-[4px]" />
      </div>
    </>
  );
}
