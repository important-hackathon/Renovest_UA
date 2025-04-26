'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
        <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden px-4">

            {/* Full background */}
            <Image
                src="/assets/images/sign-up-bg.svg"
                alt="Background"
                fill
                className="object-cover pointer-events-none z-0"
            />

            {/* Building */}
            <div className="absolute bottom-0 right-40 w-[300px] sm:w-[300px] z-10 pointer-events-none">
                <Image
                    src="/assets/images/building-bg.svg"
                    alt="Building"
                    width={500}
                    height={800}
                    className="w-full h-auto"
                />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="relative bg-white/60 p-10 rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col gap-8 backdrop-blur-xl z-20">
                <h1 className="text-3xl font-bold text-center text-black">LOG IN INTO YOUR ACCOUNT</h1>

                <div className="flex flex-col gap-6 items-center">
                    <div className="flex flex-col gap-2 w-1/2">
                        <label className="text-black text-center">Email</label>
                        <input
                            type="email"
                            placeholder="Type your email.."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-lime-300 rounded-full px-5 py-2 focus:outline-none bg-white"
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-1/2">
                        <label className="text-black text-center">Password</label>
                        <input
                            type="password"
                            placeholder="Type your password.."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-lime-300 rounded-full px-5 py-2 focus:outline-none bg-white"
                        />
                    </div>
                </div>

                {error && <p className="text-center text-red-500 text-sm">{error}</p>}

                <button type="submit" className="w-fit self-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-12 rounded-full text-lg transition">
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
