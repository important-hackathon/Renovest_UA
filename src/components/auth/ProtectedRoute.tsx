'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/utils/auth-service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // User is not logged in, redirect to login
      router.push('/auth/login');
    } else if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      // User doesn't have the required role
      router.push('/unauthorized');
    }
  }, [user, isLoading, router, requiredRole]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, don't render children
  if (!user) {
    return null;
  }

  // If role is required and user doesn't have it, don't render
  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  // Render the protected content
  return <>{children}</>;
};