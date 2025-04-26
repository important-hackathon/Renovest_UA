'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

interface CreateProjectFormProps {
  onSuccess?: () => void;
}

export default function CreateProjectForm({ onSuccess }: CreateProjectFormProps): React.ReactNode {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [investmentGoal, setInvestmentGoal] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to create a project.');
        return;
      }

      let imageUrl = '';

      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) {
          setError(uploadError.message);
          return;
        }

        const { data } = supabase.storage.from('project-images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('projects')
        .insert({
          owner_id: user.id,
          title,
          description,
          investment_goal: Number(investmentGoal),
          image_url: imageUrl,
          investment_received: 0,
          status: 'pending'
        });

      if (insertError) {
        setError(insertError.message);
      } else {
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
          router.push('/dashboard/my-projects');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="space-y-4">
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
                Upload a high-quality image that represents your project.
              </p>
              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 flex justify-center items-center"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Create Project'
        )}
      </button>
    </form>
  );
}

// Set default props to avoid the TypeScript error
CreateProjectForm.defaultProps = {
  onSuccess: undefined
};