'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import CreateProjectForm from '@/components/projects/CreateProjectForm';
import ToolCard from '@/components/projects/ToolCard';

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);
    };

    fetchUser();
  }, [supabase, router]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const role = user.user_metadata?.role || 'investor';

  return (
    <section className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Welcome, {user.user_metadata?.name || 'User'}</h1>

        {/* Show tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {role === 'owner' && (
            <>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="border-2 border-dashed border-blue-400 p-6 rounded-lg text-center text-lg font-bold text-blue-500 hover:bg-blue-100 transition"
              >
                + Create New Project
              </button>
              <ToolCard title="My Projects" href="/dashboard/my-projects" />
            </>
          )}

          {role === 'investor' && (
            <>
              <ToolCard title="Browse Projects" href="/projects" />
              <ToolCard title="My Investments" href="/dashboard/my-investments" />
            </>
          )}
        </div>

        {/* Show Create Project Form */}
        {showCreateForm && <CreateProjectForm />}
      </div>
    </section>
  );
}
