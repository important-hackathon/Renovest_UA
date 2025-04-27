// src/app/projects/[id]/reports/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { MoveLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Define interfaces for our data
interface Report {
  id: number;
  date: string;
  title: string;
  description: string;
  images: string[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  investment_goal: number;
  investment_received: number;
  image_url?: string;
  status: string;
  created_at: string;
}

export default function ProjectReportsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        setError("Project ID is missing");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Fetch project data
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();

        if (projectError) {
          console.error("Error fetching project:", projectError);
          setError(`Failed to load project: ${projectError.message}`);
          setLoading(false);
          return;
        }

        setProject(projectData);

        // For demo purposes, we'll create mock reports since we don't have a reports table
        // In a real application, you would fetch this from your database
        const mockReports: Report[] = [
          {
            id: 1,
            date: '01.03.2025',
            title: 'Stage 1 Completed',
            description: 'New photos from the construction site are now available! The images showcase the progress made over the past month, highlighting foundation work, material installation, and initial assembly stages.',
            images: ['/assets/temp/slider1.jpg', '/assets/temp/slider2.jpg']
          },
          {
            id: 2,
            date: '01.03.2025',
            title: 'New Materials Purchased',
            description: 'Essential construction materials, including reinforced concrete and high-grade steel, have been purchased and delivered to the site. Procurement was completed with verified suppliers to ensure quality and reliability.',
            images: ['/assets/temp/slider3.jpg', '/assets/temp/slider4.jpg']
          },
          {
            id: 3,
            date: '01.03.2025',
            title: 'Photo Report: Work in Progress',
            description: 'New photos from the construction site are now available! The images showcase the progress made over the past month, highlighting foundation work, material installation, and initial assembly stages.',
            images: ['/assets/temp/slider1.jpg', '/assets/temp/slider3.jpg']
          },
        ];

        setReports(mockReports);
      } catch (err) {
        console.error("Unexpected error during fetch:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const openImageModal = (image: string) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col gap-4 w-full max-w-3xl">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-40 bg-gray-200 rounded w-full"></div>
          <div className="h-40 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 p-8 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Error Loading Project Reports
          </h2>
          <p className="text-gray-700">{error}</p>
          <Link
            href="/projects"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4">
            Project Not Found
          </h2>
          <p className="text-gray-700">The requested project could not be found.</p>
          <Link
            href="/projects"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Browse Projects
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(project.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate progress percentage
  const percent = Math.min(
    Math.round(
      (Number(project.investment_received) / Number(project.investment_goal)) *
        100
    ),
    100
  );

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
              <span className="text-black">Back</span>
            </button>
          </div>

          {/* Project Header */}
          <div className="mb-10 border-b-3 border-[#D7DDE7] pb-8">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3">
                <div className="relative h-48 w-full overflow-hidden rounded-xl">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
              </div>
              <div className="md:w-2/3">
                <h1 className="font-bold text-2xl mb-2">{project.title}</h1>
                <div className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-[8px] max-w-[150px] mb-4" />
                <p className="mb-4">{project.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-semibold">{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Created On</p>
                    <p className="font-semibold">{formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Investment Goal</p>
                    <p className="font-semibold">${Number(project.investment_goal).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Progress</p>
                    <p className="font-semibold">{percent}% funded</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Updates & Reports Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Project Updates & Reports</h2>
            <div className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-2 max-w-35 mx-auto" />
          </div>

          {/* Reports List */}
          <div className="space-y-6">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                  selectedReport?.id === report.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-[#C6FF80]'
                }`}
              >
                <div className="grid grid-cols-12 items-center">
                  {/* Report number section with background image */}
                  <div className="col-span-12 md:col-span-2 p-4 md:p-6 text-center border-b md:border-b-0 md:border-r border-gray-200 relative overflow-hidden">
                    {/* Background image */}
                    {report.images.length > 0 && (
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={report.images[0]}
                          alt={`Background for ${report.title}`}
                          fill
                          className="object-cover opacity-25"
                          sizes="(max-width: 768px) 100vw, 20vw"
                        />
                      </div>
                    )}
                    {/* Light overlay */}
                    <div className="absolute inset-0 bg-gray-50 opacity-15 z-5"></div>
                    {/* Content */}
                    <div className="relative z-10">
                      <p className="text-xl font-bold text-blue-600">Report #{report.id}</p>
                      <p className="text-gray-500">{report.date}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-12 md:col-span-7 p-4 md:p-6">
                    <h3 className="text-xl font-bold mb-2">{report.title}</h3>
                    <p className="text-gray-700">{report.description}</p>
                  </div>
                  
                  <div className="col-span-12 md:col-span-3 p-4 md:p-6 flex justify-center md:justify-end">
                    <button
                      onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                      className="bg-[#C6FF80] text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-[#b5ff60] hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                      {selectedReport?.id === report.id ? 'Hide Details' : 'View'}
                    </button>
                  </div>
                </div>
                
                {/* Report Detail Section (Expanded) */}
                {selectedReport?.id === report.id && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <h4 className="font-bold text-lg mb-4">Images & Documentation</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {report.images.map((image, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden cursor-pointer" onClick={() => openImageModal(image)}>
                          <div className="aspect-square relative">
                            <Image
                              src={image}
                              alt={`${report.title} image ${idx + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-black z-10 hover:bg-[#C6FF80] transition-colors"
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </button>
            <div className="relative h-[80vh]">
              <Image
                src={selectedImage}
                alt="Enlarged image"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}