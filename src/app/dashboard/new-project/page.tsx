'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreateProjectForm from '@/components/projects/CreateProjectForm';
import { MoveLeft } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard/my-projects');
  };

  return (
    <section className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => router.push('/dashboard/my-projects')}
            className="mr-4 rounded-full bg-[#C6FF80] px-3 py-1.5 flex items-center gap-2 text-base font-semibold hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <MoveLeft size={18} />
            <span className="text-black">Back</span>
          </button>
          <h1 className="text-3xl font-bold">Create New Project</h1>
        </div>

        <div className="bg-white shadow-md rounded-xl p-8">
          <CreateProjectForm onSuccess={handleSuccess} />
        </div>
      </div>
    </section>
  );
}