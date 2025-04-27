'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { MoveLeft } from 'lucide-react';
import Image from 'next/image';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  investment_goal: number;
  investment_received: number;
  image_url?: string;
  owner_id: string;
  status: 'pending' | 'approved' | 'completed';
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [investmentGoal, setInvestmentGoal] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/auth/login');
          return;
        }

        // Fetch project data
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        // Verify project ownership
        if (data.owner_id !== user.id) {
          throw new Error('You are not authorized to edit this project');
        }

        setProject(data);
        setTitle(data.title);
        setDescription(data.description);
        setInvestmentGoal(data.investment_goal.toString());
        
        // If project has an image, set it for preview
        if (data.image_url) {
          setPreview(data.image_url);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load project data');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    // Create preview URL
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Prepare update data
      const updateData: any = {
        title,
        description,
        investment_goal: Number(investmentGoal)
      };

      // Handle file upload if a new file is selected
      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data } = supabase.storage.from('project-images').getPublicUrl(filePath);
        updateData.image_url = data.publicUrl;
      }

      // Update project in database
      const { error: updateError } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId)
        .eq('owner_id', user.id); // Ensure ownership check

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess('Project updated successfully!');
      
      // Update local state to reflect changes
      setProject(prev => prev ? {...prev, ...updateData} : null);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/my-projects');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
      console.error('Error updating project:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen py-20">
        <div className="animate-pulse flex flex-col gap-4 w-full max-w-3xl">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="flex items-center justify-center min-h-screen py-20">
        <div className="bg-red-50 border border-red-200 p-8 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard/my-projects')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to My Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => router.push('/dashboard/my-projects')}
            className="mr-4 rounded-full bg-[#C6FF80] px-3 py-1.5 flex items-center gap-2 text-base font-semibold hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <MoveLeft size={18} />
            <span className="text-black">Back</span>
          </button>
          <h1 className="text-3xl font-bold">Edit Project</h1>
        </div>

        <div className="bg-white shadow-md rounded-xl p-8">
          {/* Current Project Preview */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-bold mb-4">Current Project</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {project?.image_url ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-xl">
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 h-48 w-full rounded-xl flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="md:w-2/3">
                <h3 className="font-bold text-lg mb-1">{project?.title}</h3>
                <p className="text-gray-700 mb-3 text-sm">{project?.description}</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Investment Goal</p>
                    <p className="font-semibold">${Number(project?.investment_goal).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current Funding</p>
                    <p className="font-semibold">${Number(project?.investment_received).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-semibold capitalize">{project?.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Update Project Details</h2>
            
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {success}
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter a clear title for your project"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                id="description"
                placeholder="Describe your project in detail"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="investmentGoal" className="block text-sm font-medium text-gray-700 mb-1">
                Investment Goal ($)
              </label>
              <input
                id="investmentGoal"
                type="number"
                placeholder="Amount needed for your project"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={investmentGoal}
                onChange={(e) => setInvestmentGoal(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Image
              </label>
              <div className="flex items-center gap-4">
                <div
                  className={`border-2 border-dashed ${
                    preview ? 'border-gray-300' : 'border-blue-300 hover:border-blue-500'
                  } rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors w-1/3`}
                  onClick={() => document.getElementById('project-image')?.click()}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded" />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-blue-500 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-500">Upload Image</p>
                    </>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    id="project-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mb-2">
                    {project?.image_url ? 'Current image will be replaced if you upload a new one.' : 'Upload a high-quality image that represents your project.'}
                  </p>
                  {preview && (
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreview(project?.image_url || null);
                      }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      {file ? 'Cancel upload' : 'Remove image'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/my-projects')}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50 flex items-center"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}