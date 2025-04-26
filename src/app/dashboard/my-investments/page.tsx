'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Define the exact structure of project data
interface ProjectData {
  id: string;
  title: string;
  description: string;
  investment_goal: number;
  investment_received: number;
  image_url?: string;
}

// Define the structure of investment data from Supabase (raw response)
interface RawInvestmentData {
  id: string;
  amount: number;
  created_at: string;
  project_id: string;
  projects: ProjectData[] | null; // From Supabase it comes as an array or null
}

// Define the expected investment structure for our component
interface Investment {
  id: string;
  amount: number;
  created_at: string;
  project_id: string;
  project?: ProjectData; // Transformed to a single object
}

export default function MyInvestmentsPage() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalInvested, setTotalInvested] = useState(0);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth');
          return;
        }

        // Using correct join syntax based on your DB structure
        const { data, error } = await supabase
          .from('investments')
          .select(`
            id,
            amount,
            created_at,
            project_id,
            projects:project_id(
              id, 
              title, 
              description, 
              investment_goal, 
              investment_received, 
              image_url
            )
          `)
          .eq('investor_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching investments:', error);
          setLoading(false);
          return;
        }

        console.log('Raw investment data:', data);
        
        if (data && data.length > 0) {
          // Transform the data to match our Investment interface
          const transformedData: Investment[] = data.map((item: RawInvestmentData) => ({
            id: item.id,
            amount: item.amount,
            created_at: item.created_at,
            project_id: item.project_id,
            // Extract the first project if it exists
            project: item.projects && item.projects.length > 0 ? item.projects[0] : undefined
          }));
          
          setInvestments(transformedData);
          
          // Calculate total invested
          const total = transformedData.reduce((sum, inv) => sum + Number(inv.amount), 0);
          setTotalInvested(total);
        } else {
          setInvestments([]);
          setTotalInvested(0);
        }
      } catch (err) {
        console.error('Failed to fetch investments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [router]);

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

  return (
    <section className="min-h-screen py-12 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Investments</h1>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Invested</p>
            <p className="text-2xl font-bold text-blue-600">${totalInvested.toLocaleString()}</p>
          </div>
        </div>

        {investments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-6">You haven't made any investments yet.</p>
            <Link href="/projects" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors">
              Browse Projects to Invest
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {investments.map((investment) => {
              // Get project data from our transformed structure
              const project = investment.project;
              
              return (
                <div key={investment.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
                  <div className="relative h-40 w-full md:w-1/4 md:h-auto">
                    {project?.image_url ? (
                      <div className="relative h-full">
                        <Image 
                          src={project.image_url} 
                          alt={project.title || 'Project'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-100 h-full flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">{project?.title || 'Untitled Project'}</h3>
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        ${Number(investment.amount).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project?.description || 'No description available'}
                    </p>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Invested on {new Date(investment.created_at).toLocaleDateString()}
                        </p>
                        {project && (
                          <p className="text-sm mt-1">
                            <span className="text-gray-500">Project Progress: </span>
                            <span className="font-medium">
                              ${Number(project.investment_received).toLocaleString()} / 
                              ${Number(project.investment_goal).toLocaleString()}
                            </span>
                          </p>
                        )}
                      </div>
                      
                      <Link
                        href={`/projects/${investment.project_id}`}
                        className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                      >
                        View Project →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}