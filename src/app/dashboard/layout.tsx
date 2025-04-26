"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  const navigationItems =
    user.role === "project_owner"
      ? [
          { name: "My Projects", href: "/dashboard/projects", current: true },
          {
            name: "Create Project",
            href: "/dashboard/projects/create",
            current: false,
          },
          { name: "Updates", href: "/dashboard/updates", current: false },
        ]
      : [
          {
            name: "My Investments",
            href: "/dashboard/investments",
            current: true,
          },
          { name: "Favorites", href: "/dashboard/favorites", current: false },
          { name: "Reports", href: "/dashboard/reports", current: false },
        ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="text-white font-bold text-xl">
                  Renovest UA
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <Link
                  href="/projects"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Browse Projects
                </Link>
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="text-white mr-4">{user.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="bg-blue-700 p-1 rounded-full text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                    >
                      <span className="px-2 py-1">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/projects"
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Projects
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-blue-700">
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {user.email}
                  </div>
                  <div className="text-sm font-medium leading-none text-blue-200 mt-1">
                    {user.role === "project_owner"
                      ? "Project Owner"
                      : "Investor"}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === "project_owner"
              ? "Project Owner Dashboard"
              : "Investor Dashboard"}
          </h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
