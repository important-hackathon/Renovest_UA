"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
    { name: "FAQ", href: "/faq" },
    { name: "Contacts", href: "/contacts" },
    { name: "About Us", href: "/about" },
    { name: "News", href: "/news" },
    { name: "Projects", href: "/projects" },
    { name: "Profile", href: "/profile" },
];

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full bg-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                <Link href="/" className="text-2xl font-bold text-black">
                    Renovest UA
                </Link>
                <nav className="hidden gap-8 md:flex">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-lg font-semibold text-black hover:text-gray-600 transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                        className="text-black"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="flex flex-col items-center gap-6 pb-6 md:hidden">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-lg font-semibold text-black hover:text-gray-600 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
};
