'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import Image from 'next/image';
import InvestmentModal from '@/components/investments/InvestmentsModal';

export default function ProjectDetailsPage() {
  // Use the useParams hook instead of receiving params as a prop
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
        console.error('Project ID is undefined');
        setError('Project ID is missing');
        setLoading(false);
        return;
      }

      console.log('Fetching project with ID:', projectId);
      setLoading(true);
      
      try {
        // Fetch user data
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
        } else {
          setUserData(user);
        }
        
        // First, let's check if the project exists
        const { data: checkData, error: checkError } = await supabase
          .from('projects')
          .select('id')
          .eq('id', projectId)
          .single();
          
        if (checkError) {
          console.error('Error checking project existence:', checkError);
          if (checkError.code === 'PGRST116') {
            setError('Project not found');
            setLoading(false);
            return;
          }
        }
        
        console.log('Project exists check:', checkData);
        
        // Fetch project data with full details
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select(`
            id,
            title,
            description,
            investment_goal,
            investment_received,
            image_url,
            created_at,
            status,
            owner_id
          `)
          .eq('id', projectId)
          .single();

        if (fetchError) {
          console.error('Error fetching project details:', fetchError);
          setError(`Failed to load project: ${fetchError.message}`);
          setLoading(false);
          return;
        }
        
        console.log('Project data:', data);
        
        // If we have project data, fetch the owner details
        if (data) {
          // Separate query for owner to simplify
          const { data: ownerData, error: ownerError } = await supabase
            .from('users')
            .select(`
              id,
              email,
              phone
            `)
            .eq('id', data.owner_id)
            .single();
            
          if (ownerError) {
            console.error('Error fetching owner details:', ownerError);
          } else {
            console.log('Owner data:', ownerData);
            // Combine project with owner data
            setProject({
              ...data,
              owner: ownerData
            });
          }
        } else {
          setProject(data);
        }
      } catch (err) {
        console.error('Unexpected error during fetch:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error Loading Project</h2>
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
    Math.round((Number(project.investment_received) / Number(project.investment_goal)) * 100),
    100
  );
  
  // Check if current user is the owner
  const isOwner = userData?.id === project.owner?.id;
  
  // Format date
  const formattedDate = new Date(project.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Status Badge */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span 
              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                project.status === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : project.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Unknown Status'}
            </span>
            <span className="text-gray-500 text-sm">Listed on {formattedDate}</span>
          </div>
        </div>
        
        {/* Image */}
        <div className="mb-8 relative rounded-xl overflow-hidden h-80 w-full">
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Title & Description */}
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            <p className="text-gray-700 mb-8 whitespace-pre-line">{project.description}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            {/* Progress Information */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">
                  ${Number(project.investment_received).toLocaleString()}
                </h3>
                <span className="text-sm text-gray-500">
                  of ${Number(project.investment_goal).toLocaleString()} goal
                </span>
              </div>
              
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{percent}% Funded</p>
            </div>
            
            {/* Investment Button or Owner Badge */}
            {isOwner ? (
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-center">
                <p className="text-blue-700 font-medium">You are the owner of this project</p>
              </div>
            ) : (
              <button
                onClick={() => setIsInvestModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold transition-colors"
              >
                Invest in This Project
              </button>
            )}
            
            {/* Owner Contact */}
            {project.owner && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-3">Project Owner</h3>
                <p className="mb-1">
                  <span className="text-gray-500">Email: </span>
                  <span className="font-medium">{project.owner.email}</span>
                </p>
                {project.owner.phone && (
                  <p>
                    <span className="text-gray-500">Phone: </span>
                    <span className="font-medium">{project.owner.phone}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Investment Modal */}
      {project && (
        <InvestmentModal
          projectId={project.id}
          projectTitle={project.title}
          isOpen={isInvestModalOpen}
          onClose={() => setIsInvestModalOpen(false)}
        />
      )}
    </section>
  );
}