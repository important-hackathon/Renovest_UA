'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreateProjectForm from '@/components/projects/CreateProjectForm';

interface UserData {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    role?: 'investor' | 'owner';
    phone?: string;
  };
}

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalInvested: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user as UserData);

      // Fetch stats based on user role
      if (user.user_metadata?.role === 'owner') {
        const { data: projects, error } = await supabase
          .from('projects')
          .select('id')
          .eq('owner_id', user.id);
        
        if (!error) {
          setStats(prev => ({ ...prev, totalProjects: projects?.length || 0 }));
        }
      } else if (user.user_metadata?.role === 'investor') {
        const { data: investments, error } = await supabase
          .from('investments')
          .select('amount')
          .eq('investor_id', user.id);
        
        if (!error) {
          const total = (investments || []).reduce((sum, inv) => sum + Number(inv.amount), 0);
          setStats(prev => ({ ...prev, totalInvested: total }));
        }
      }
    };

    fetchUserData();
  }, [supabase, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const role = user.user_metadata?.role || 'investor';
  const name = user.user_metadata?.name || 'User';

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {name}</h1>
              <p className="text-blue-100">{role === 'owner' ? 'Project Owner Dashboard' : 'Investor Dashboard'}</p>
            </div>
            <div className="hidden md:block bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              {role === 'owner' ? (
                <>
                  <p className="text-sm">Your Projects</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </>
              ) : (
                <>
                  <p className="text-sm">Total Invested</p>
                  <p className="text-2xl font-bold">${stats.totalInvested.toLocaleString()}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats for Mobile */}
          <div className="md:hidden bg-white p-6 rounded-xl shadow-sm">
            {role === 'owner' ? (
              <>
                <p className="text-gray-500">Your Projects</p>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
              </>
            ) : (
              <>
                <p className="text-gray-500">Total Invested</p>
                <p className="text-2xl font-bold">${stats.totalInvested.toLocaleString()}</p>
              </>
            )}
          </div>

          {/* Action Cards */}
          {role === 'owner' && (
            <>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center border-2 border-dashed border-blue-300 hover:border-blue-500"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Create New Project</h3>
                <p className="text-gray-500 text-sm mt-1">Add a new investment opportunity</p>
              </button>

              <Link href="/dashboard/my-projects" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center">
                <div className="bg-green-100 p-3 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">My Projects</h3>
                <p className="text-gray-500 text-sm mt-1">View and manage your projects</p>
              </Link>
            </>
          )}

          {role === 'investor' && (
            <>
              <Link href="/projects" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Browse Projects</h3>
                <p className="text-gray-500 text-sm mt-1">Discover new investment opportunities</p>
              </Link>

              <Link href="/dashboard/my-investments" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center">
                <div className="bg-green-100 p-3 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">My Investments</h3>
                <p className="text-gray-500 text-sm mt-1">Track your investment portfolio</p>
              </Link>
            </>
          )}

          {/* Additional Card */}
          <Link href={role === 'owner' ? '/projects' : '/dashboard/profile'} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {role === 'owner' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                )}
              </svg>
            </div>
            <h3 className="font-bold text-gray-900">{role === 'owner' ? 'View All Projects' : 'My Profile'}</h3>
            <p className="text-gray-500 text-sm mt-1">{role === 'owner' ? 'See available opportunities' : 'View and edit your profile'}</p>
          </Link>
        </div>

        {/* Create Project Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <CreateProjectForm />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}