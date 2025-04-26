'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  investment_goal: number;
  investment_received: number;
  image_url?: string;
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading your projects...</div>;
  }

  return (
    <section className="min-h-screen py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">My Projects</h1>

        {projects.length === 0 ? (
          <p className="text-center text-gray-600">You have no projects yet. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="border-2 rounded-lg p-6 hover:shadow-lg transition bg-gray-50">
                <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                <div className="text-sm text-gray-500 mb-2">
                  Goal: ${project.investment_goal}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Raised: ${project.investment_received}
                </div>

                <Link
                  href={`/dashboard/my-projects/${project.id}/edit`}
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
                >
                  Edit Project
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
