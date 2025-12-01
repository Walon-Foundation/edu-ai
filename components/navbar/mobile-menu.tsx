"use client";

import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export function MobileMenu({
  isMenuOpen,
  setIsMenuOpen,
  isLoggedIn,
  setIsLoggedIn,
}: MobileMenuProps) {
  const { user } = useUser();
  const clerk = useClerk();
  const router = useRouter();

  if (!isMenuOpen) return null;

  const handleSignOut = async () => {
    try {
      await clerk.signOut();
      setIsLoggedIn(false);
      setIsMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="md:hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-md">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-indigo-600 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-indigo-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className="text-gray-700 hover:text-indigo-600 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-indigo-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Upload PDF
            </Link>
            <div className="border-t border-gray-200/60 mt-2 pt-2">
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:bg-red-50 block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-indigo-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/howitworks"
              className="text-gray-700 hover:text-indigo-600 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-indigo-50"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="border-t border-gray-200/60 mt-2 pt-2 space-y-2">
              <Link href="/sign-in">
                <button className="text-gray-700 hover:text-indigo-600 block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-50">
                  Sign In
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white block w-full text-left px-3 py-3 rounded-lg text-base font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm">
                  Get Started
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
