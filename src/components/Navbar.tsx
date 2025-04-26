'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import Logo from '../../public/assets/images/Renovest\UA.svg'

export default function Header() {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Main navigation links
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Projects', path: '/projects' },
    { title: 'About', path: '/about' },
  ];

  // Additional links for authenticated users
  const authLinks = [
    { title: 'Dashboard', path: '/dashboard' },
    { title: user?.user_metadata?.role === 'owner' ? 'My Projects' : 'My Investments', 
      path: user?.user_metadata?.role === 'owner' ? '/dashboard/my-projects' : '/dashboard/my-investments' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src={Logo.src} alt="RenovestUA Logo" className="h-4 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Main Nav Links */}
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`text-gray-700 hover:text-blue-600 transition ${
                  pathname === link.path ? 'font-semibold text-blue-600' : ''
                }`}
              >
                {link.title}
              </Link>
            ))}
            
            {/* Auth Links - shown only when logged in */}
            {user && authLinks.map(link => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`text-gray-700 hover:text-blue-600 transition ${
                  pathname === link.path ? 'font-semibold text-blue-600' : ''
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard/profile" className="text-sm text-gray-700 hover:text-blue-600">
                  {user.user_metadata?.name || user.email}
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-full text-sm transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/auth" 
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Log In
                </Link>
                <Link 
                  href="/auth"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full text-sm transition"
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
            <ul className="flex flex-col gap-3">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    className={`block py-2 text-gray-700 hover:text-blue-600 ${
                      pathname === link.path ? 'font-semibold text-blue-600' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
              
              {user ? (
                <>
                  {/* Auth Links for logged in users */}
                  {authLinks.map(link => (
                    <li key={link.path}>
                      <Link 
                        href={link.path}
                        className={`block py-2 text-gray-700 hover:text-blue-600 ${
                          pathname === link.path ? 'font-semibold text-blue-600' : ''
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link 
                      href="/dashboard/profile"
                      className="block py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-red-600 hover:text-red-800"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/auth"
                      className="block py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/auth"
                      className="block py-2 font-medium text-blue-600 hover:text-blue-800"
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