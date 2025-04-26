'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  // New fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('investor');

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (isRegister) {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone, role }, // store extra data inside user metadata
        },
      });
      if (signupError) {
        setError(signupError.message);
      } else {
        alert('Registered successfully! Please check your email (if enabled).');
        router.push('/');
      }
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) {
        setError(loginError.message);
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-green-200">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">{isRegister ? 'Create Account' : 'Sign In'}</h1>

        {isRegister && (
          <>
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="border p-3 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <select
              className="border p-3 rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="investor">Investor</option>
              <option value="owner">Project Owner</option>
            </select>
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold">
          {isRegister ? 'Register' : 'Login'}
        </button>

        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-500 text-sm text-center underline"
        >
          {isRegister ? 'Already have an account? Sign In' : 'No account? Register here'}
        </button>
      </form>
    </div>
  );
}
