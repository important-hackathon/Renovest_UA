'use client';

import React, { useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface InvestmentModalProps {
  projectId: string;
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvestmentModal({ 
  projectId, 
  projectTitle,
  isOpen, 
  onClose 
}: InvestmentModalProps): React.ReactNode {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to invest');
        router.push('/auth/login');
        return;
      }

      // Add the investment record
      const { error: investError } = await supabase
        .from('investments')
        .insert({
          project_id: projectId,
          investor_id: user.id,
          amount: Number(amount),
        });

      if (investError) throw investError;

      // Update the project's investment_received amount
      const { error: updateError } = await supabase.rpc('update_project_investment', {
        p_project_id: projectId,
        p_amount: Number(amount)
      });

      if (updateError) throw updateError;

      // Success
      onClose();
      router.refresh();
      alert('Investment successful!');
    } catch (err: any) {
      setError(err.message || 'An error occurred during the investment process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Invest in Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <h3 className="text-lg font-medium mb-4">{projectTitle}</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Investment Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Investment'}
          </button>
        </form>
      </div>
    </div>
  );
}