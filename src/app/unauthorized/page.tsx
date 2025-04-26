import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            You don't have permission to access this page.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
