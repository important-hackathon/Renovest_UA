'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DeleteProject from '@/components/projects/DeleteProject';

interface Project {
  id: string;
  title: string;
  description: string;
  investment_goal: number;
  investment_received: number;
  image_url?: string;
  status: 'pending' | 'approved' | 'completed';
}

export default function MyProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading your projects...</div>;
  }

  return (
    <section className="min-h-screen py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Projects</h1>
          
          <div className="flex gap-3">
            <Link
              href="/dashboard/new-project"
              className="bg-[#C6FF80] hover:bg-[#b5ff60] text-black px-5 py-2 rounded-md font-medium transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Project
            </Link>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">You haven't created any projects yet</h3>
            <p className="text-gray-600 mb-8">Start by creating your first investment opportunity</p>
            <Link
              href="/dashboard/new-project"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold"
            >
              Create New Project
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="border-b border-gray-200 last:border-b-0 p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {project.image_url && (
                          <div className="hidden sm:block h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={project.image_url} 
                              alt={project.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold">{project.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div>
                              <span className="text-gray-500">Goal: </span>
                              <span className="font-medium">${project.investment_goal.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Raised: </span>
                              <span className="font-medium">${project.investment_received.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Progress: </span>
                              <span className="font-medium">
                                {Math.min(Math.round((project.investment_received / project.investment_goal) * 100), 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                      <Link
                        href={`/projects/${project.id}`}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-sm font-medium"
                      >
                        View
                      </Link>
                      
                      <Link
                        href={`/dashboard/my-projects/${project.id}/edit`}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition text-sm font-medium"
                      >
                        Edit
                      </Link>
                      
                      <DeleteProject 
                        projectId={project.id}
                        projectTitle={project.title}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}