'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalInvestments: 0,
    investmentAmount: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!isLoading && user) {
      fetchDashboardData();
    }
  }, [user, isLoading, router]);

  const fetchDashboardData = async () => {
    setIsDataLoading(true);
    const supabase = createClient();

    try {
      if (user?.role === 'investor') {
        // Fetch investor stats
        const { data: investments, error: investmentsError } = await supabase
          .from('investments')
          .select('amount, status, created_at, project:projects(id, title, status)')
          .eq('investor_id', user.id)
          .order('created_at', { ascending: false });

        if (investmentsError) throw investmentsError;

        const totalInvestments = investments?.length || 0;
        const investmentAmount = investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
        const activeProjects = new Set(
          investments
            ?.filter(inv => inv.project && inv.project.status === 'active')
            .map(inv => inv.project.id)
        ).size;
        const completedProjects = new Set(
          investments
            ?.filter(inv => inv.project && inv.project.status === 'completed')
            .map(inv => inv.project.id)
        ).size;

        setStats({
          totalProjects: activeProjects + completedProjects,
          activeProjects,
          completedProjects,
          totalInvestments,
          investmentAmount,
        });

        // Set recent activity (last 5 investments)
        setRecentActivity(
          investments
            ?.slice(0, 5)
            .map(inv => ({
              type: 'investment',
              date: inv.created_at,
              amount: inv.amount,
              projectTitle: inv.project?.title || 'Unknown Project',
              projectId: inv.project?.id,
            })) || []
        );
      } else if (user?.role === 'project_owner') {
        // Fetch project owner stats
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('id, title, status, raised_amount, goal_amount, created_at')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;

        const totalProjects = projects?.length || 0;
        const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
        const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
        const totalRaised = projects?.reduce((sum, p) => sum + (p.raised_amount || 0), 0) || 0;

        setStats({
          totalProjects,
          activeProjects,
          completedProjects,
          totalInvestments: 0, // Not relevant for project owner
          investmentAmount: totalRaised,
        });

        // Also fetch recent investments for the projects
        const projectIds = projects?.map(p => p.id) || [];
        
        if (projectIds.length > 0) {
          const { data: recentInvestments, error: investmentsError } = await supabase
            .from('investments')
            .select('amount, created_at, project_id, projects(title)')
            .in('project_id', projectIds)
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (!investmentsError && recentInvestments) {
            setRecentActivity(
              recentInvestments.map(inv => ({
                type: 'received_investment',
                date: inv.created_at,
                amount: inv.amount,
                projectId: inv.project_id,
                projectTitle: projects?.find(p => p.id === inv.project_id)?.title || 'Unknown Project',
              }))
            );
          } else {
            // If no investments or error, use project creation as activity
            setRecentActivity(
              projects
                ?.slice(0, 5)
                .map(p => ({
                  type: 'project_created',
                  date: p.created_at,
                  projectId: p.id,
                  projectTitle: p.title,
                  goalAmount: p.goal_amount,
                })) || []
            );
          }
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  if (isLoading || isDataLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user.email}. Here's an overview of your {user.role === 'investor' ? 'investments' : 'projects'}.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {user.role === 'investor' ? 'Total Projects Invested' : 'Total Projects'}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.totalProjects}
            </dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Active Projects
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.activeProjects}
            </dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {user.role === 'investor' ? 'Total Investments' : 'Completed Projects'}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {user.role === 'investor' ? stats.totalInvestments : stats.completedProjects}
            </dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {user.role === 'investor' ? 'Total Amount Invested' : 'Total Funds Raised'}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              ${stats.investmentAmount.toLocaleString()}
            </dd>
          </div>
        </div>
      </div>
      
      {/* Quick Action Buttons */}
      <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {user.role === 'investor' ? (
              <>
                <Link href="/projects">
                  <div className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full">
                    Browse Projects
                  </div>
                </Link>
                <Link href="/dashboard/investments">
                  <div className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 w-full">
                    View My Investments
                  </div>
                </Link>
                <Link href="/dashboard/favorites">
                  <div className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 w-full">
                    Saved Projects
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard/projects/create">
                  <div className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full">
                    Create New Project
                  </div>
                </Link>
                <Link href="/dashboard/projects">
                  <div className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 w-full">
                    Manage Projects
                  </div>
                </Link>
                <Link href="/dashboard/updates">
                  <div className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 w-full">
                    Post Updates
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity to display.</p>
          ) : (
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activityIdx}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.type === 'investment' 
                              ? 'bg-blue-500' 
                              : activity.type === 'received_investment' 
                              ? 'bg-green-500' 
                              : 'bg-purple-500'
                          }`}>
                            {activity.type === 'investment' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {activity.type === 'received_investment' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            )}
                            {activity.type === 'project_created' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                              </svg>
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.type === 'investment' && (
                                <>
                                  Invested <span className="font-medium text-gray-900">${activity.amount.toLocaleString()}</span> in{' '}
                                  <Link href={`/projects/${activity.projectId}`} className="font-medium text-blue-600 hover:text-blue-500">
                                    {activity.projectTitle}
                                  </Link>
                                </>
                              )}
                              {activity.type === 'received_investment' && (
                                <>
                                  Received investment of <span className="font-medium text-gray-900">${activity.amount.toLocaleString()}</span> for{' '}
                                  <Link href={`/projects/${activity.projectId}`} className="font-medium text-blue-600 hover:text-blue-500">
                                    {activity.projectTitle}
                                  </Link>
                                </>
                              )}
                              {activity.type === 'project_created' && (
                                <>
                                  Created project{' '}
                                  <Link href={`/projects/${activity.projectId}`} className="font-medium text-blue-600 hover:text-blue-500">
                                    {activity.projectTitle}
                                  </Link>{' '}
                                  with a goal of <span className="font-medium text-gray-900">${activity.goalAmount.toLocaleString()}</span>
                                </>
                              )}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={activity.date}>
                              {new Date(activity.date).toLocaleDateString()}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
          {user.role === 'investor' ? (
            <Link href="/dashboard/investments">
              <div className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all investments<span aria-hidden="true"> &rarr;</span>
              </div>
            </Link>
          ) : (
            <Link href="/dashboard/projects">
              <div className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all projects<span aria-hidden="true"> &rarr;</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}