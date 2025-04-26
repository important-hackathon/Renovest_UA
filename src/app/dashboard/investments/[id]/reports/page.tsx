'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function InvestmentReports() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const investmentId = params.id;

  const [investment, setInvestment] = useState(null);
  const [reports, setReports] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated or not an investor
    if (!isLoading && (!user || user.role !== 'investor')) {
      if (!user) {
        router.push('/auth/login');
      } else {
        router.push('/unauthorized');
      }
    } else if (!isLoading && user) {
      // Fetch investment and reports data
      // In a real app, this would be an API call to fetch from Supabase
      setIsDataLoading(true);
      
      // Mock data for demonstration
      setTimeout(() => {
        setInvestment({
          id: Number(investmentId),
          projectId: 5,
          projectTitle: 'Kyiv Housing Reconstruction',
          projectCategory: 'Infrastructure',
          amountInvested: 10000,
          investmentDate: '2025-03-15',
          status: 'active',
          progressPercentage: 45,
          returns: null,
          expectedCompletion: '2025-12-31'
        });
        
        setReports([
          {
            id: 1,
            title: 'Project Initiation Report',
            date: '2025-03-20',
            description: 'Initial project setup and planning phase completed.',
            type: 'progress',
            attachments: [
              { name: 'Initial Site Survey.pdf', url: '#' },
              { name: 'Project Timeline.pdf', url: '#' }
            ]
          },
          {
            id: 2,
            title: 'Financial Allocation Report',
            date: '2025-03-28',
            description: 'Breakdown of fund allocation for different aspects of the project.',
            type: 'financial',
            attachments: [
              { name: 'Budget Allocation.pdf', url: '#' },
              { name: 'Expense Report.xlsx', url: '#' }
            ]
          },
          {
            id: 3,
            title: 'Groundbreaking Ceremony Report',
            date: '2025-04-10',
            description: 'Documentation of the official groundbreaking ceremony and start of construction.',
            type: 'progress',
            attachments: [
              { name: 'Ceremony Photos.zip', url: '#' },
              { name: 'Construction Schedule.pdf', url: '#' }
            ]
          }
        ]);
        
        setIsDataLoading(false);
      }, 1000);
    }
  }, [user, isLoading, router, investmentId]);

  if (isLoading || isDataLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-8">
          <div className="spinner"></div>
          <p className="mt-2">Loading reports...</p>
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
          <p className="text-gray-600">{investment.projectTitle}</p>
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
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${investment.amountInvested.toLocaleString()}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Investment Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(investment.investmentDate).toLocaleDateString()}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Project Progress</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${investment.progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 mt-1">{investment.progressPercentage}% complete</span>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Expected Completion</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(investment.expectedCompletion).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Reports */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
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
              <p className="text-gray-500">No reports available yet.</p>
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
                          report.type === 'financial' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {report.type === 'financial' ? 'Financial' : 'Progress'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</p>
                      <p className="mt-2 text-sm text-gray-700">{report.description}</p>
                      
                      {report.attachments && report.attachments.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-gray-700">Attachments</h5>
                          <ul className="mt-1 space-y-1">
                            {report.attachments.map((attachment, idx) => (
                              <li key={idx} className="flex items-center text-sm">
                                <svg className="mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                </svg>
                                <a href={attachment.url} className="text-blue-600 hover:underline">
                                  {attachment.name}
                                </a>
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