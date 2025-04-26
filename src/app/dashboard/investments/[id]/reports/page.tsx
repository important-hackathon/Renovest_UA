'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface ProjectType {
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
}

interface Investment {
  id: number;
  amount: number;
  status: string;
  created_at: string;
  project: ProjectType;
}

interface Attachment {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface Report {
  id: number;
  title: string;
  content: string;
  report_type: string;
  created_at: string;
  is_public: boolean;
  project_id: number;
  attachments?: Attachment[];
}

export default function InvestmentReports() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const investmentId = params.id;

  const [investment, setInvestment] = useState<Investment | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated or not an investor
    if (!isLoading && (!user || user.role !== 'investor')) {
      if (!user) {
        router.push('/auth/login');
      } else {
        router.push('/unauthorized');
      }
      return;
    }

    if (!isLoading && user) {
      fetchInvestmentAndReports();
    }
  }, [isLoading, user, investmentId, router]);

  const fetchInvestmentAndReports = async () => {
    if (!user || !investmentId) return;
    
    setIsDataLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      // Fetch investment details including project info
      const { data: investmentData, error: investmentError } = await supabase
        .from('investments')
        .select(`
          id,
          amount,
          status,
          created_at,
          project_id
        `)
        .eq('id', investmentId)
        .eq('investor_id', user.id)
        .single();
      
      if (investmentError) throw investmentError;
      
      if (!investmentData) {
        throw new Error('Investment not found or you do not have permission to view it');
      }
      
      // Now fetch the project details separately
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`
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
        `)
        .eq('id', investmentData.project_id)
        .single();
      
      if (projectError) throw projectError;
      
      if (!projectData) {
        throw new Error('Project not found');
      }
      
      // Combine investment and project data
      const investmentWithProject: Investment = {
        id: investmentData.id,
        amount: investmentData.amount,
        status: investmentData.status,
        created_at: investmentData.created_at,
        project: projectData as ProjectType
      };
      
      setInvestment(investmentWithProject);
      
      // Fetch project reports
      const projectId = projectData.id;
      
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select(`
          id,
          title,
          content,
          report_type,
          created_at,
          is_public,
          project_id
        `)
        .eq('project_id', projectId)
        .eq('is_public', true) // Only show public reports to investors
        .order('created_at', { ascending: false });
      
      if (reportsError) throw reportsError;
      
      // For each report, fetch attachments
      const reportsWithAttachments = await Promise.all(
        (reportsData || []).map(async (report) => {
          const { data: attachmentsData, error: attachmentsError } = await supabase
            .from('report_attachments')
            .select(`
              id,
              file_name,
              file_url,
              file_type,
              file_size,
              created_at
            `)
            .eq('report_id', report.id);
          
          if (attachmentsError) {
            console.error('Error fetching attachments:', attachmentsError);
            return {
              ...report,
              attachments: []
            };
          }
          
          return {
            ...report,
            attachments: attachmentsData as Attachment[]
          };
        })
      );
      
      setReports(reportsWithAttachments as Report[]);
      
    } catch (err: any) {
      console.error('Error fetching investment data:', err);
      setError(err.message || 'Failed to load investment data');
    } finally {
      setIsDataLoading(false);
    }
  };

  // Calculate project progress
  const calculateProgressPercentage = (investment: Investment) => {
    if (!investment || !investment.project) return 0;
    return Math.round((investment.project.raised_amount / investment.project.goal_amount) * 100);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading || isDataLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <Link
            href="/dashboard/investments"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Investments
          </Link>
        </div>
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900">Investment not found</h3>
          <p className="mt-2 text-sm text-gray-500">
            The investment you're looking for does not exist or you don't have access to it.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/investments"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Investments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Project Reports</h2>
          <p className="text-gray-600">{investment.project.title}</p>
        </div>
        <Link 
          href="/dashboard/investments"
          className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Investments
        </Link>
      </div>

      {/* Investment Summary */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Investment Summary
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Investment Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${investment.amount.toLocaleString()}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Investment Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(investment.created_at)}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Project Progress</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${calculateProgressPercentage(investment)}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 mt-1">{calculateProgressPercentage(investment)}% complete</span>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Expected Completion</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {investment.project.expected_completion_date 
                  ? formatDate(investment.project.expected_completion_date)
                  : 'Not specified'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  investment.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : investment.status === 'completed' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Reports */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Detailed Reports
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Transparent updates on project progress and financial details.
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No reports available yet. Check back later for updates on your investment.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {reports.map((report) => (
                <li key={report.id} className="px-4 py-5 sm:px-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-lg font-semibold text-gray-900">{report.title}</h4>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.report_type === 'financial' 
                            ? 'bg-green-100 text-green-800' 
                            : report.report_type === 'progress' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{formatDate(report.created_at)}</p>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{report.content}</p>
                      </div>
                      
                      {report.attachments && report.attachments.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-gray-700">Attachments</h5>
                          <ul className="mt-1 space-y-1">
                            {report.attachments.map((attachment) => (
                              <li key={attachment.id} className="flex items-center text-sm">
                                <svg className="mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                </svg>
                                <a href={attachment.file_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                  {attachment.file_name}
                                </a>
                                <span className="ml-2 text-xs text-gray-500">
                                  ({formatFileSize(attachment.file_size)})
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        View Full Report
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}