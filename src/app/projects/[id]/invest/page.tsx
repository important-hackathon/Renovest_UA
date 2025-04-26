'use client';

import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  goal_amount: number;
  raised_amount: number;
  location: string;
  status: string;
  image_url?: string;
}

export default function InvestPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;
  
  const [project, setProject] = useState<Project | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);

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
      fetchProject();
    }
  }, [isLoading, user, projectId, router]);

  const fetchProject = async () => {
    if (!projectId) return;
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      
      setProject(data);
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError('Failed to load project details. Please try again later.');
    } finally {
      setIsProjectLoading(false);
    }
  };

  const handleInvestmentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setInvestmentAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    // Validation
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      setError('Please enter a valid investment amount');
      return;
    }
    
    const amount = parseFloat(investmentAmount);
    
    if (amount < 10) {
      setError('Minimum investment amount is $10');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      
      // Create investment record
      const { data, error: investmentError } = await supabase
        .from('investments')
        .insert([
          {
            investor_id: user?.id,
            project_id: projectId,
            amount: amount,
            status: 'active',
            transaction_id: `txn-${Date.now()}`, // In a real app, this would be from a payment processor
            payment_method: 'credit_card' // Simplified for this example
          }
        ])
        .select();
      
      if (investmentError) throw investmentError;
      
      // Update project raised amount
      if (project) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({ 
            raised_amount: project.raised_amount + amount 
          })
          .eq('id', projectId);
        
        if (updateError) throw updateError;
      }
      
      // Success
      setSuccessMessage('Investment successful! Thank you for supporting this project.');
      setInvestmentAmount('');
      
      // Refresh project data
      fetchProject();
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/dashboard/investments`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error processing investment:', err);
      setError(err.message || 'Failed to process investment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isProjectLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p className="ml-3">Loading...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Project Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              The project you're looking for does not exist or has been removed.
            </p>
            <Link 
              href="/projects"
              className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">Invest in Project</h1>
                <Link href={`/projects/${projectId}`} className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  « Back to Project
                </Link>
              </div>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{project.category} • {project.location}</p>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Current Progress</span>
                    <span>{Math.round((project.raised_amount / project.goal_amount) * 100)}% of ${project.goal_amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min((project.raised_amount / project.goal_amount) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between text-sm">
                    <span className="font-medium">${project.raised_amount.toLocaleString()} raised</span>
                    <span className="font-medium">${project.goal_amount.toLocaleString()} goal</span>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
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
              )}
              
              {successMessage && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700">
                      Investment Amount (USD)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        name="investmentAmount"
                        id="investmentAmount"
                        value={investmentAmount}
                        onChange={handleInvestmentAmountChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        aria-describedby="investment-amount-currency"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm" id="investment-amount-currency">
                          USD
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Minimum investment: $10. You can invest any amount above this threshold.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="payment-card"
                          name="payment-method"
                          type="radio"
                          defaultChecked
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="payment-card" className="ml-3 block text-sm font-medium text-gray-700">
                          Credit / Debit Card
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="payment-paypal"
                          name="payment-method"
                          type="radio"
                          disabled
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="payment-paypal" className="ml-3 block text-sm font-medium text-gray-500">
                          PayPal (Coming Soon)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="payment-crypto"
                          name="payment-method"
                          type="radio"
                          disabled
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="payment-crypto" className="ml-3 block text-sm font-medium text-gray-500">
                          Cryptocurrency (Coming Soon)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Your Investment</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        ${investmentAmount ? parseFloat(investmentAmount).toFixed(2) : '0.00'}
                      </dd>
                    </div>
                    <div className="flex justify-between mt-2">
                      <dt className="text-sm text-gray-500">Platform Fee (2%)</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        ${investmentAmount ? (parseFloat(investmentAmount) * 0.02).toFixed(2) : '0.00'}
                      </dd>
                    </div>
                    <div className="flex justify-between mt-2 border-t border-gray-100 pt-2">
                      <dt className="text-sm font-medium text-gray-900">Total</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        ${investmentAmount ? (parseFloat(investmentAmount) * 1.02).toFixed(2) : '0.00'}
                      </dd>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="terms" className="text-sm text-gray-600">
                          I agree to the <span className="text-blue-600 hover:text-blue-500">Terms and Conditions</span> and understand the risks associated with investing in reconstruction projects.
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Complete Investment'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Investment Information</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">How your investment works</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Your investment directly supports the reconstruction of Ukraine. Funds are released to project owners in stages as they reach milestones, ensuring proper use of funds.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Transparency and reporting</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Project owners provide regular updates and detailed financial reports. You'll have access to all this information in your investor dashboard.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Risk disclaimer</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    While we verify all projects thoroughly, investing in reconstruction projects carries inherent risks. Please review the full risk disclosure in our terms and conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}