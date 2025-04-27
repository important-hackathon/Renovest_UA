'use client';

import React, { useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion'; // <-- ADD THIS

interface InvestmentModalProps {
  projectId: string;
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvestmentModal({ projectId, projectTitle, isOpen, onClose }: InvestmentModalProps): React.ReactNode {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to invest');
        router.push('/auth/login');
        return;
      }

      const { error: investError } = await supabase
          .from('investments')
          .insert({
            project_id: projectId,
            investor_id: user.id,
            amount: Number(amount),
          });

      if (investError) throw investError;

      const { error: updateError } = await supabase.rpc('update_project_investment', {
        p_project_id: projectId,
        p_amount: Number(amount),
      });

      if (updateError) throw updateError;

      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during the investment process');
    } finally {
      setLoading(false);
    }
  };

  return (
      <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                  initial={{opacity: 0, scale: 0.8}}
                  animate={{opacity: 1, scale: 1}}
                  exit={{opacity: 0, scale: 0.8}}
                  transition={{duration: 0.2, ease: 'easeOut'}}
                  className="bg-white rounded-4xl w-full max-w-md p-8 shadow-lg relative"
              >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
                >
                  ✕
                </button>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Invest in</h2>
                  <h3 className="text-lg font-semibold text-blue-600">{projectTitle}</h3>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Amount ($)
                    </label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                    />
                  </div>

                  {error && (
                      <div
                          className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-2xl text-center text-sm">
                        {error}
                      </div>
                  )}

                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm Investment'}
                  </button>
                </form>
              </motion.div>
            </div>
        )}
      </AnimatePresence>
  );
}
