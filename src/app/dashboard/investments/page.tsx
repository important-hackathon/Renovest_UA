'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

// Define the exact structure that Supabase returns
interface SupabaseInvestment {
  id: number;
  amount: number;
  status: string;
  created_at: string;
  project: {
    id: number;
    title: string;
    description: string;
    category: string;
    goal_amount: number;
    raised_amount: number;
    status: string;
    expected_completion_date: string;
    location: string;
    image_url?: string;
  } | null;
  latest_update: {
    id: number;
    title: string;
    created_at: string;
  }[] | null;
}

// Our processed investment interface
interface Investment {
  id: number;
  amount: number;
  status: string;
  created_at: string;
  project: {
    id: number;
    title: string;
    description: string;
    category: string;
    goal_amount: number;
    raised_amount: number;
    status: string;
    expected_completion_date: string;
    location: string;
    image_url?: string;
  };
  latest_update?: {
    id: number;
    title: string;
    created_at: string;
  };
}

export default function InvestorDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isInvestmentsLoading, setIsInvestmentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
    // Redirect if not authenticated or not an investor
    if (!isLoading && (!user || user.role !== 'investor')) {
      if (!user) {
        router.push('/auth/login');
      } else {
        router.push('/unauthorized');
      }
    } else if (!isLoading && user) {
      fetchInvestments();
    }
  }, [user, isLoading, router, activeTab]);

  const fetchInvestments = async () => {
    setIsInvestmentsLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      let query = supabase
        .from('investments')
        .select(`
          id,
          amount,
          status,
          created_at,
          project:projects(
            id, 
            title, 
            description, 
            category, 
            goal_amount, 
            raised_amount, 
            status,
            expected_completion_date,
            location,
            image_url
          ),
          latest_update:project_updates(
            id,
            title,
            created_at
          )
        `)
        .eq('investor_id', user?.id)
        .order('created_at', { ascending: false });
      
      // Filter by status if not on 'all' tab
      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }
      
      // For the latest update, we want to join with project_updates and get the most recent one
      query = query.order('latest_update.created_at', { foreignTable: 'project_updates', ascending: false });
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Process the data to match our Investment interface
      const processedData: Investment[] = (data as unknown as SupabaseInvestment[])
        .filter(item => item.project !== null) // Skip investments with missing project data
        .map(item => {
          // Get the most recent update if any
          const latestUpdate = item.latest_update && item.latest_update.length > 0 
            ? item.latest_update[0] 
            : undefined;
            
          return {
            id: item.id,
            amount: item.amount,
            status: item.status,
            created_at: item.created_at,
            project: item.project as Investment['project'], // We've filtered out nulls
            latest_update: latestUpdate
          };
        });
      
      setInvestments(processedData);
    } catch (err: any) {
      console.error('Error fetching investments:', err);
      setError(err.message || 'Failed to load your investments');
    } finally {
      setIsInvestmentsLoading(false);
    }
  };

  // Calculate investment statistics
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const activeProjects = investments.filter(inv => inv.status === 'active').length;
  const newUpdatesCount = investments.filter(inv => 
    inv.latest_update && new Date(inv.latest_update.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  if (isLoading || isInvestmentsLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-8">
          <div className="spinner"></div>
          <p className="mt-2">Loading investments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">My Investments</h2>
          <Link 
            href="/projects"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Find New Projects
          </Link>
        </div>
        
        {/* Tab Navigation */}
        <div className="mt-4">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Investments
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'completed'
                  ? 'bg-gray-100 text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed
            </button>
          </nav>
        </div>
        
        {/* Investment Summary */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Invested
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                ${totalInvested.toLocaleString()}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Active Projects
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {activeProjects}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                New Updates (7 days)
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {newUpdatesCount}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {investments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No investments yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            {activeTab === 'all'
              ? 'Explore projects and start investing in Ukraine\'s future.'
              : `You don't have any ${activeTab} investments right now.`}
          </p>
          <div className="mt-6">
            <Link
              href="/projects"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 mb-8">
          {investments.map((investment) => (
            <div key={investment.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{investment.project.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                      {investment.project.category}
                    </span>
                    <p className="mt-1 text-sm text-gray-500">
                      Invested: ${investment.amount.toLocaleString()} on {new Date(investment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                    <Link
                      href={`/projects/${investment.project.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                    >
                      View Project
                    </Link>
                    <Link
                      href={`/dashboard/investments/${investment.id}/reports`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Reports
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((investment.project.raised_amount / investment.project.goal_amount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((investment.project.raised_amount / investment.project.goal_amount) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-5 border-t border-gray-200 pt-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Latest Update:</span> 
                    {investment.latest_update ? (
                      <>
                        <span className="ml-1 font-medium">{investment.latest_update.title}</span>
                        <span className="ml-2 text-gray-500">({new Date(investment.latest_update.created_at).toLocaleDateString()})</span>
                      </>
                    ) : (
                      <span className="ml-1 text-gray-500">No updates yet</span>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Expected Completion:</span> 
                    <span className="ml-1 font-medium">
                      {investment.project.expected_completion_date 
                        ? new Date(investment.project.expected_completion_date).toLocaleDateString() 
                        : 'Not specified'}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Location:</span> 
                    <span className="ml-1 font-medium">{investment.project.location}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-between text-sm">
                <span className="text-gray-500">Investment ID: #{investment.id}</span>
                <span className={`font-medium ${
                  investment.status === 'active' 
                    ? 'text-green-600' 
                    : investment.status === 'completed' 
                    ? 'text-blue-600' 
                    : investment.status === 'pending'
                    ? 'text-yellow-600'
                    : 'text-gray-600'
                }`}>
                  {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}