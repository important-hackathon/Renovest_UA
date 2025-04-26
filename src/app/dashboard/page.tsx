'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, [supabase]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-10">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.user_metadata?.name || user.email}!</h1>
      <p className="text-xl">
        You are registered as a <span className="font-semibold">{user.user_metadata?.role || 'user'}</span>.
      </p>
      <p className="mt-2 text-gray-600">Phone: {user.user_metadata?.phone || 'N/A'}</p>
    </div>
  );
}
