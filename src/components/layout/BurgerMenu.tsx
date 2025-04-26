'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { navigation } from '@/constants/navigation';

export default function BurgerMenu() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    const openMenu = () => {
        setVisible(true);
        setTimeout(() => setAnimateIn(true), 10);
    };

    const closeMenu = () => {
        setAnimateIn(false);
        setTimeout(() => setVisible(false), 400);
    };

    return (
        <>
            {/* Open Burger Button */}
            <button
                onClick={openMenu}
                aria-label="Open menu"
                className="md:hidden text-black relative z-50"
            >
                <Menu className="w-7 h-7" />
            </button>

            {visible && (
                <div
                    className={clsx(
                        'fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center px-6 transition-all duration-400 ease-in-out',
                        animateIn
                            ? 'translate-y-0 opacity-100 pointer-events-auto'
                            : '-translate-y-full opacity-0 pointer-events-none'
                    )}
                >
                    <button
                        onClick={closeMenu}
                        aria-label="Close menu"
                        className="absolute top-5 right-5 text-black"
                    >
                        <X className="w-7 h-7" />
                    </button>

                    <nav className="flex flex-col items-center gap-8 text-black text-xl font-semibold">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={closeMenu}
                                className={clsx(
                                    'transition',
                                    isActive(item.href) ? 'underline underline-offset-4' : ''
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
}
