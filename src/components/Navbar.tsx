'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">Renovest UA</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                href="/projects"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Projects
              </Link>
              {user && (
                user.role === 'project_owner' ? (
                  <Link 
                    href="/dashboard/projects"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    My Projects
                  </Link>
                ) : (
                  <Link 
                    href="/dashboard/investments"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    My Investments
                  </Link>
                )
              )}
            </div>
          </div>
          <div className="flex items-center">
            {isLoading ? (
              <span>Loading...</span>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span>{user.email}</span>
                <button 
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link 
                  href="/auth/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-white text-blue-600 hover:bg-gray-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};