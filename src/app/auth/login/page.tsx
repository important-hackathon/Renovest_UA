'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthInput } from '@/components/auth/AuthInput';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-green-200 overflow-hidden px-4">
            <Image
                src="/assets/images/file.svg" // Replace with your SVG path
                alt="Background"
                fill
                className="object-cover opacity-20 pointer-events-none"
            />
            <form onSubmit={handleSubmit} className="relative bg-white/90 p-10 rounded-3xl shadow-lg max-w-md w-full flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-center text-black">WELCOME BACK</h1>

                <AuthInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <AuthInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                {error && <p className="text-center text-red-500 text-sm">{error}</p>}

                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full text-lg transition">
                    Login
                </button>

                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-blue-500 underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}
