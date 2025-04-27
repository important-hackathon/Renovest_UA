"use client";

import React, { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { MoveLeft, Wand } from "lucide-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Carousel from "@/components/ui/Carousel";
import Image from "next/image";
import { SwiperSlide } from "swiper/react";
import { stages } from "./stages";
import InvestmentModal from "@/components/investments/InvestmentsModal";
import ProjectReportsButton from "@/components/projects/ProjectReportsButton";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Placeholder images (until we have real project images)
  const [images, setImages] = useState<string[]>([
    "/assets/temp/slider1.jpg",
    "/assets/temp/slider2.jpg",
    "/assets/temp/slider3.jpg",
    "/assets/temp/slider4.jpg",
  ]);

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
          // We're using mock data for owners instead of fetching real data
          console.log("Using mock owner data instead of real credentials");

          // Skip fetching real owner data since we're using mock data
          /*
          let { data: ownerData, error: ownerError } = await supabase
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
            
          // If no user data or error, set default values
          if (ownerError || !ownerData) {
            console.log("Falling back to basic user data");
            ownerData = {
              id: data.owner_id,
              email: "Owner information unavailable",
              phone: ""
            };
          }

          console.log("Owner data:", ownerData);
          */

          // Update images array if project has an image
          if (data.image_url) {
            // Create a new array instead of modifying the state directly
            const updatedImages = [data.image_url, ...images.slice(0, 3)];
            setImages(updatedImages);
          }

          // Use project data without real owner details
          setProject({
            ...data,
            // We'll use mock owner data in the render instead
          });

          // Update images array if project has an image
          if (data.image_url) {
            setImages([data.image_url, ...images.slice(0, 3)]);
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
  }, [projectId]); // Remove images from the dependency array

  if (loading) {
    return (
      <div className="flex items-center justify-center h-auto">
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

  // Mock owner data instead of using real credentials
  const ownerName = "Project Manager";
  const ownerPhone = "+380 (XX) XXX-XX-XX";
  const ownerEmail = "manager@renovestua.com";

  return (
    <>
      <section className="h-auto bg-white text-black py-12 mt-10">
        <div className="max-w-7xl mx-auto px-5 box-border">
          <div className="mb-5">
            <button
              onClick={() => router.back()}
              className="rounded-full bg-[#C6FF80] cursor-pointer px-3 py-1.5 flex items-center gap-2 text-base md:text-xl font-semibold hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <MoveLeft />
              <span className="text-black">Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full h-full pb-120 md:pb-90 lg:pb-35 border-[#D7DDE7] items-start">
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
                          alt={`${project.title} image ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: "cover" }}
                        />
                      </SwiperSlide>
                    ))}
                  </Carousel>
                </div>

                <div className="mt-6 mb-10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {images.slice(0, 4).map((img, index) => (
                      <div className="rounded-xl overflow-hidden" key={index}>
                        <img
                          src={img}
                          alt={`${project.title} thumbnail ${index + 1}`}
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
                    <p className="font-bold">{ownerName}</p>
                  </div>

                  {/*Contacts*/}
                  <div className="text-lg mb-7">
                    <p>Contacts:</p>
                    <p className="font-bold">{ownerPhone}</p>
                    <p className="font-bold">{ownerEmail}</p>
                  </div>
                </div>
              </div>
            )}

            {/*Info*/}
            <div className="order-1 md:order-last relative text-[#432907]">
              <div className="mb-5">
                <h1 className="font-bold text-2xl mb-5">{project.title}</h1>

                <div className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-[8px] max-w-[150px] mb-5" />

                <p className="">{project.description}</p>
              </div>

              {/*Bond details*/}
              <div className="mb-5">
                <h2 className="font-bold text-xl mb-2">Project details</h2>
                <ul className="list-disc pl-7">
                  <li>
                    Investment Goal: $
                    {Number(project.investment_goal).toLocaleString()}
                  </li>
                  <li>
                    Current Investment: $
                    {Number(project.investment_received).toLocaleString()}
                  </li>
                  <li>Progress: {percent}% funded</li>
                  <li>
                    Status:{" "}
                    {project.status
                      ? project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)
                      : "Active"}
                  </li>
                  <li>Created: {formattedDate}</li>
                </ul>
              </div>

              {/*Project verification*/}
              <div className="mb-8">
                <h2 className="font-bold text-xl mb-2">Project Verification</h2>
                <ul className="list-disc pl-7">
                  <li>Verified through Renovest UA platform</li>
                  <li>Full transparency through platform reporting</li>
                </ul>
              </div>

              <div className="flex gap-5 flex-wrap">
                <ProjectReportsButton projectId={project.id} />
                <button
                  onClick={() => setIsInvestModalOpen(true)}
                  className="bg-[#0088FF] px-6 py-2 text-white rounded-full font-bold text-base md:text-lg cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Invest now
                </button>

                <button className="flex items-center gap-2 bg-gradient-to-r from-[#0088FF] to-[#8e0dab] px-6 py-2 text-white rounded-full font-bold text-base md:text-lg cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">
                  <Wand />
                  Risk Analysis
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
          <button
            onClick={() => setIsInvestModalOpen(true)}
            className="bg-[#0088FF] text-white px-6 md:px-12 py-2.5 font-bold text-lg md:text-2xl rounded-full hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
          >
            Invest in this project
          </button>
        </div>

        <div className="max-w-[700px] mx-auto bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-[4px]" />
      </div>

      {/* Investment Modal */}
      <InvestmentModal
        projectId={project.id}
        projectTitle={project.title}
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
      />
    </>
  );
}
