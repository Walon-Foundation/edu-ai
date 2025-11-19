"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const { isSignedIn, user } = useUser();
  const clerk = useClerk();

  useEffect(() => {
    setIsLoggedIn(!!isSignedIn);
  }, [isSignedIn]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleSignOut = async () => {
    try {
      await clerk.signOut();
      setIsLoggedIn(false);
      setIsProfileOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    if (firstName || lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return user.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase() || 'U';
  };

  const getUserName = () => {
    if (!user) return 'User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.username || 'User';
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              EduAI
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isLoggedIn ? (
                // Navigation for logged in users
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
                // Navigation for logged out users
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

          {/* Auth Buttons / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              /* Profile Dropdown */
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 leading-none">
                      {getUserName()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200/60 backdrop-blur-md">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons for logged out users */
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <button className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50">
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm"
                >
                  <span className="text-white font-semibold text-sm">
                    {getUserInitials()}
                  </span>
                </button>

                {/* Mobile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200/60 backdrop-blur-md">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isLoggedIn ? (
                // Mobile menu for logged in users
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                // Mobile menu for logged out users
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
        )}
      </div>

      {/* Overlay to close dropdowns when clicking outside */}
      {(isProfileOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
          onClick={() => {
            setIsProfileOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
}