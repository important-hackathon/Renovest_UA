'use client';

import { useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface DeleteProjectProps {
  projectId: string;
  projectTitle: string;
}

export default function DeleteProject({ projectId, projectTitle }: DeleteProjectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to delete a project');
        return;
      }

      // First check if the user owns this project
      const { data: projectData, error: fetchError } = await supabase
        .from('projects')
        .select('owner_id')
        .eq('id', projectId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (projectData.owner_id !== user.id) {
        throw new Error('You do not have permission to delete this project');
      }

      // Check if the project has any investments
      const { data: investments, error: investmentsError } = await supabase
        .from('investments')
        .select('id')
        .eq('project_id', projectId)
        .limit(1);

      if (investmentsError) {
        throw new Error(investmentsError.message);
      }

      if (investments && investments.length > 0) {
        throw new Error('Cannot delete project with existing investments');
      }

      // Proceed with deletion
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('owner_id', user.id); // Extra safety check

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Close modal and refresh
      closeModal();
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
      console.error('Error deleting project:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="text-red-500 hover:text-red-700 text-sm font-medium"
      >
        Delete
      </button>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Delete Project</h3>
            <p className="mb-6">
              Are you sure you want to delete <span className="font-semibold">{projectTitle}</span>? This action cannot be undone.
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}