import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

export default async function ProjectsPage() {
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
  
  // Fetch projects from Supabase
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  // Categories for filter buttons
  const categories = ['All', 'Infrastructure', 'Healthcare', 'Education', 'Housing', 'Environment', 'Technology', 'Cultural'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
            
            <div className="mt-4 mb-8">
              <div className="flex flex-wrap gap-4">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={category === 'All' ? '/projects' : `/projects?category=${category}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
            
            {error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">Failed to load projects. Please try again later.</p>
                  </div>
                </div>
              </div>
            ) : projects && projects.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are no active projects at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects && projects.map((project: Project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gray-200 relative">
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">{project.title}</h2>
                      <p className="text-gray-600 mt-2 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.min((project.raised_amount / project.goal_amount) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-sm">
                          <span>${project.raised_amount.toLocaleString()} raised</span>
                          <span>${project.goal_amount.toLocaleString()} goal</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{Math.round((project.raised_amount / project.goal_amount) * 100)}% funded</span>
                          <span>{project.location}</span>
                        </div>
                      </div>
                      <Link href={`/projects/${project.id}`}>
                        <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}