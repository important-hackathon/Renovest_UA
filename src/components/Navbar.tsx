'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import Logo from '../../public/assets/images/RenovestUA.svg'

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // Scroll event listener for sticky header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Main navigation links
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Projects', path: '/projects' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-4' : 'bg-white/80 backdrop-blur-sm py-7'
      }`}
    >
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src={Logo.src} alt="RenovestUA Logo" className="h-6 w-auto" />
          </Link>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center gap-10">
            {/* Main Navigation Links */}
            <nav className="flex items-center gap-10">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`text-gray-800 hover:text-blue-600 transition text-lg font-semibold ${
                    pathname === link.path ? 'font-bold text-blue-600' : ''
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            {user ? (
              <Link 
                href="/dashboard" 
                className="text-gray-800 hover:text-gray-900 font-semibold text-lg"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-8">
                <Link 
                  href="/auth" 
                  className="text-gray-800 hover:text-blue-600 transition text-lg font-semibold"
                >
                  Log In
                </Link>
                <Link 
                  href="/auth"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-full text-lg font-semibold transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <ul className="flex flex-col gap-4">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    className={`block py-2.5 text-gray-800 hover:text-blue-600 text-lg font-semibold ${
                      pathname === link.path ? 'font-bold text-blue-600' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
              
              {user ? (
                <li>
                  <Link 
                    href="/dashboard"
                    className="block py-2.5 font-semibold text-gray-800 hover:text-gray-900 text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/auth"
                      className="block py-2.5 text-gray-800 hover:text-blue-600 text-lg font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/auth"
                      className="block py-2.5 font-bold text-blue-600 hover:text-blue-800 text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}