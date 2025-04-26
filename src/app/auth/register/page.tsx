'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthInput } from '@/components/auth/AuthInput';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('investor');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const { error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, phone, role },
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
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-green-200 overflow-hidden px-4">
            <Image
                src="/assets/images/file.svg"
                alt="Background"
                fill
                className="object-cover opacity-20 pointer-events-none"
            />
            <form onSubmit={handleSubmit} className="relative bg-white/90 p-10 rounded-3xl shadow-lg max-w-2xl w-full flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-center text-black">CREATE YOUR ACCOUNT</h1>

                <AuthInput type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <AuthInput type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <select
                    className="w-full border border-lime-400 rounded-full px-5 py-3 focus:outline-none"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="investor">Investor</option>
                    <option value="owner">Project Owner</option>
                </select>
                <AuthInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <AuthInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                {error && <p className="text-center text-red-500 text-sm">{error}</p>}

                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full text-lg transition">
                    Register
                </button>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-blue-500 underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
