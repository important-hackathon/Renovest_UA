'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          investment_goal,
          investment_received,
          image_url,
          owner:owner_id (
            id,
            email,
            phone
          )
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
      }
      setProject(data);
      setLoading(false);
    };

    fetchProject();
  }, [params.id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!project) {
    notFound(); // return 404 if no project found
  }

  const percent = Math.min(
    Math.round((Number(project.investment_received) / Number(project.investment_goal)) * 100),
    100
  );

  return (
    <section className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Image */}
        <div className="mb-8">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-80 object-cover rounded-lg"
            />
          ) : (
            <div className="bg-gray-200 h-80 w-full flex items-center justify-center text-gray-500 rounded-lg">
              No Image
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        <p className="text-gray-700 mb-8">{project.description}</p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>${project.investment_received} / ${project.investment_goal}</span>
            <span>{percent}% Funded</span>
          </div>
        </div>

        {/* Owner Contact */}
        {project.owner && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Project Owner Contact</h2>
            <p>Email: {project.owner.email}</p>
            <p>Phone: {project.owner.phone || 'N/A'}</p>
          </div>
        )}
      </div>
    </section>
  );
}
