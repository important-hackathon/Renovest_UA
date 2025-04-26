'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  goalAmount: string;
  timeline: string;
  location: string;
  imageUrl: string;
  expectedCompletionDate: string;
}

export default function CreateProjectPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: 'Infrastructure',
    goalAmount: '',
    timeline: '',
    location: '',
    imageUrl: '',
    expectedCompletionDate: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated or not a project owner
    if (!isLoading && (!user || user.role !== 'project_owner')) {
      if (!user) {
        router.push('/auth/login');
      } else {
        router.push('/unauthorized');
      }
    }
  }, [user, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }
    
    if (!formData.goalAmount) {
      newErrors.goalAmount = 'Goal amount is required';
    } else if (isNaN(Number(formData.goalAmount)) || Number(formData.goalAmount) <= 0) {
      newErrors.goalAmount = 'Goal amount must be a positive number';
    }
    
    if (!formData.timeline.trim()) {
      newErrors.timeline = 'Timeline is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.expectedCompletionDate) {
      newErrors.expectedCompletionDate = 'Expected completion date is required';
    } else {
      const today = new Date();
      const selectedDate = new Date(formData.expectedCompletionDate);
      if (selectedDate <= today) {
        newErrors.expectedCompletionDate = 'Completion date must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      
      // Upload image if provided
      let imageUrl = formData.imageUrl;
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `project-images/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-assets')
          .upload(filePath, imageFile);
        
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('project-assets')
          .getPublicUrl(filePath);
        
        imageUrl = urlData.publicUrl;
      }
      
      // Insert project record
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            owner_id: user?.id,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            goal_amount: Number(formData.goalAmount),
            raised_amount: 0,
            timeline: formData.timeline,
            location: formData.location,
            image_url: imageUrl,
            status: 'pending', // Pending approval
            expected_completion_date: formData.expectedCompletionDate,
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      setSuccessMessage('Project created successfully! It will be reviewed before being published.');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/projects');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating project:', error);
      setErrors({ submit: error.message || 'Failed to create project. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-8">
          <div className="spinner"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Create New Project
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Fill in the details to create your reconstruction project
          </p>
        </div>
        
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 m-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {errors.submit}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Project Title*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.title ? 'border-red-300' : ''}`}
                  />
                </div>
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description*
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.description ? 'border-red-300' : ''}`}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Provide a detailed description of your reconstruction project (minimum 50 characters).
                </p>
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category*
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Housing">Housing</option>
                    <option value="Environment">Environment</option>
                    <option value="Technology">Technology</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700">
                  Funding Goal (USD)*
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="goalAmount"
                    id="goalAmount"
                    value={formData.goalAmount}
                    onChange={handleChange}
                    min="1000"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.goalAmount ? 'border-red-300' : ''}`}
                  />
                </div>
                {errors.goalAmount && (
                  <p className="mt-2 text-sm text-red-600">{errors.goalAmount}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                  Estimated Timeline*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="timeline"
                    id="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    placeholder="e.g., 12 months"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.timeline ? 'border-red-300' : ''}`}
                  />
                </div>
                {errors.timeline && (
                  <p className="mt-2 text-sm text-red-600">{errors.timeline}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Project Location*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Kyiv Oblast"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.location ? 'border-red-300' : ''}`}
                  />
                </div>
                {errors.location && (
                  <p className="mt-2 text-sm text-red-600">{errors.location}</p>
                )}
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="expectedCompletionDate" className="block text-sm font-medium text-gray-700">
                  Expected Completion Date*
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="expectedCompletionDate"
                    id="expectedCompletionDate"
                    value={formData.expectedCompletionDate}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.expectedCompletionDate ? 'border-red-300' : ''}`}
                  />
                </div>
                {errors.expectedCompletionDate && (
                  <p className="mt-2 text-sm text-red-600">{errors.expectedCompletionDate}</p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Project Image
                </label>
                <div className="mt-1 flex items-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md w-full">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                  Or provide an Image URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="imageUrl"
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  If you don't upload an image, you can provide a URL to an image that represents your project.
                </p>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/dashboard/projects')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Information panel */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Project Creation Guidelines
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Important information about creating reconstruction projects.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Verification Process</h4>
              <p className="mt-1 text-sm text-gray-500">
                All projects undergo a verification process before being published on the platform. This typically takes 2-3 business days.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Required Documents</h4>
              <p className="mt-1 text-sm text-gray-500">
                You may be contacted to provide additional documentation to verify your project, including permits, official approvals, or other relevant documents.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Transparent Reporting</h4>
              <p className="mt-1 text-sm text-gray-500">
                Project owners are required to provide regular updates and transparent financial reporting throughout the project lifecycle.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Help & Support</h4>
              <p className="mt-1 text-sm text-gray-500">
                If you have any questions about creating a project, please contact our support team at <a href="mailto:support@renovestua.com" className="text-blue-600 hover:underline">support@renovestua.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}