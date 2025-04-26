'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function CreateProjectForm() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [investmentGoal, setInvestmentGoal] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

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
      });

    if (insertError) {
      setError(insertError.message);
    } else {
      router.refresh(); // Refresh dashboard after adding
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-center mb-6">Create New Project</h2>

      <input
        type="text"
        placeholder="Project Title"
        className="border p-3 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Project Description"
        className="border p-3 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Investment Goal ($)"
        className="border p-3 rounded"
        value={investmentGoal}
        onChange={(e) => setInvestmentGoal(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-3 rounded"
      />

      {error && <p className="text-red-500 text-center">{error}</p>}

      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-bold">
        Submit Project
      </button>
    </form>
  );
}
