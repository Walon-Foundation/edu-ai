"use client";

import Link from "next/link";

interface NavLinksProps {
  isLoggedIn: boolean;
}

export function NavLinks({ isLoggedIn }: NavLinksProps) {
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
            >
              Upload PDF
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
            >
              Home
            </Link>
            <Link
              href="/howitworks"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
            >
              How It Works
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
