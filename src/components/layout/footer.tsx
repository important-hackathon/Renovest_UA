'use client';

import Link from 'next/link';
import { navigation } from '@/constants/navigation';

const legalLinks = [
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Investor Disclaimer', href: '/disclaimer' },
];

export default function Footer() {
    return (
        <footer className="w-full bg-white py-10 px-4 text-black">
            <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-4">

                <div className="text-center md:text-left space-y-2">
                    <h3 className="font-bold">Contact Us</h3>
                    <p>Email: support@renovestua.com</p>
                    <p>Phone: +380 (XX) XXX-XX-XX</p>
                    <p>Address: Kyiv, Ukraine</p>
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <nav className="flex flex-wrap justify-center gap-6 font-semibold">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="hover:text-gray-600 transition-colors text-center"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="text-sm text-center">
                        Renovest UA 2025<br />
                        All rights reserved
                    </div>
                </div>

                <div className="text-center md:text-right space-y-2 text-sm">
                    {legalLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="block hover:text-gray-600 transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

            </div>
        </footer>
    );
}
