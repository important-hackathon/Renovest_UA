'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('owner');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const { error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username, phone, role },
            },
        });

        if (signupError) {
            setError(signupError.message);
        } else {
            alert('Registered successfully! Please check your email.');
            router.push('/auth/login');
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

            {/* Building image */}
            <div className="absolute bottom-0 right-40 w-[300px] sm:w-[300px] z-10 pointer-events-none">
                <Image
                    src="/assets/images/building.svg"
                    alt="Building"
                    width={500}
                    height={700}
                    className="w-full h-auto"
                />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative bg-white/60 p-10 rounded-3xl shadow-xl max-w-4xl w-full flex flex-col gap-8 backdrop-blur-xl z-20">
                <h1 className="text-3xl font-bold text-center text-black">CREATE YOUR OWN ACCOUNT</h1>

                <div className="flex flex-col items-center gap-2">
                    <p className="text-black">Choose your type</p>
                    <div className="flex gap-4 mt-2">
                        <button
                            type="button"
                            onClick={() => setRole('owner')}
                            className={`px-6 py-2 rounded-full border border-blue-400 cursor-pointer text-black transition-all duration-300 ${
                                role === 'owner' ? 'bg-lime-300' : 'bg-white'
                            }`}
                        >
                            Owner
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('investor')}
                            className={`px-6 py-2 rounded-full border border-blue-400 cursor-pointer text-black transition-all duration-300 ${
                                role === 'investor' ? 'bg-lime-300' : 'bg-white'
                            }`}
                        >
                            Investor
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-center">Username</label>
                        <input
                            type="text"
                            placeholder="Type your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full border bg-white border-lime-300 rounded-full px-5 py-2 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-center">Phone number</label>
                        <input
                            type="text"
                            placeholder="Type your phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border bg-white border-lime-300 rounded-full px-5 py-2 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-center">Gmail</label>
                        <input
                            type="email"
                            placeholder="Type your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border bg-white border-lime-300 rounded-full px-5 py-2 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-center">Password</label>
                        <input
                            type="password"
                            placeholder="Type your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border bg-white border-lime-300 rounded-full px-5 py-2 focus:outline-none"
                        />
                    </div>
                </div>

                {error && <p className="text-center text-red-500 text-sm">{error}</p>}

                <button type="submit" className="w-fit self-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-12 rounded-full text-lg transition cursor-pointer">
                    Create account
                </button>

                <p className="text-center text-sm text-gray-600 cursor-pointer">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-blue-500 underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
