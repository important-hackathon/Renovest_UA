import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

interface ProjectDetailProps {
  params: {
    id: string;
  };
}

interface ProjectUpdate {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { id } = params;
  const cookieStore = await cookies();
  
  // Create Supabase client using the server-side approach
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: { 
          domain?: string;
          path?: string;
          expires?: Date;
          maxAge?: number;
          secure?: boolean;
          sameSite?: 'strict' | 'lax' | 'none';
          httpOnly?: boolean;
        }) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: { 
          domain?: string;
          path?: string;
          expires?: Date;
          maxAge?: number;
          secure?: boolean;
          sameSite?: 'strict' | 'lax' | 'none';
          httpOnly?: boolean;
        }) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        }
      },
    }
  );
  
  // Fetch project details from Supabase
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  // Fetch project updates
  const { data: updates } = await supabase
    .from('project_updates')
    .select('id, title, content, created_at')
    .eq('project_id', id)
    .order('created_at', { ascending: false });
  
  if (error || !project) {
    notFound();
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
            <div className="relative h-64 bg-gray-200">
              {project.image_url ? (
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Link 
                  href="/projects"
                  className="inline-flex items-center px-3 py-1 rounded-md bg-white bg-opacity-80 text-gray-800 hover:bg-opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Projects
                </Link>
              </div>
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {project.category}
                </span>
              </div>
            </div>
            
            <div className="px-6 py-5">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                  <p className="mt-1 text-sm text-gray-500">{project.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Funding Progress</span>
                  <span>{Math.round((project.raised_amount / project.goal_amount) * 100)}% of ${project.goal_amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min((project.raised_amount / project.goal_amount) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-lg font-semibold text-gray-900">${project.raised_amount.toLocaleString()} raised</p>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
                <div className="w-full">
                  <Link href={`/projects/${id}/invest`}>
                    <button className="w-full px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Invest in This Project
                    </button>
                  </Link>
                </div>
                <div className="w-full mt-3 sm:mt-0">
                  <button className="w-full px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Add to Favorites
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Project Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About Project */}
              <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">About This Project</h2>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                </div>
              </div>
              
              {/* Project Updates */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Project Updates</h2>
                </div>
                <div className="px-6 py-5">
                  {updates && updates.length > 0 ? (
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {updates.map((update: ProjectUpdate, updateIdx) => (
                          <li key={update.id}>
                            <div className="relative pb-8">
                              {updateIdx !== updates.length - 1 ? (
                                <span
                                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex items-start space-x-3">
                                <div className="relative">
                                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div>
                                    <div className="text-sm">
                                      <span className="font-medium text-gray-900">{update.title}</span>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                      {formatDate(update.created_at)}
                                    </p>
                                  </div>
                                  <div className="mt-2 text-sm text-gray-700">
                                    <p>{update.content}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No updates have been posted yet.</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Project Details */}
              <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Project Details</h2>
                </div>
                <div className="px-6 py-5">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="text-sm text-gray-900">{project.location}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="text-sm text-gray-900">{project.category}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                      <dd className="text-sm text-gray-900">{project.timeline || 'Not specified'}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Expected Completion</dt>
                      <dd className="text-sm text-gray-900">
                        {project.expected_completion_date 
                          ? formatDate(project.expected_completion_date)
                          : 'Not specified'}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="text-sm text-gray-900">{formatDate(project.created_at)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {/* Project Owner */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Project Owner</h2>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Project Owner</h3>
                      <p className="text-sm text-gray-500">Verified Identity</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="mt-1 w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Contact Project Owner
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}