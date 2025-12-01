"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavLinks } from "./navbar/nav-links";
import { UserMenu } from "./navbar/user-menu";
import { MobileMenu } from "./navbar/mobile-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const { isSignedIn } = useUser();

  useEffect(() => {
    setIsLoggedIn(!!isSignedIn);
  }, [isSignedIn]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          <NavLinks isLoggedIn={isLoggedIn} />

          {/* Auth Buttons / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <UserMenu
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
                setIsLoggedIn={setIsLoggedIn}
              />
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
              <UserMenu
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
                setIsLoggedIn={setIsLoggedIn}
              />
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
        <MobileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
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
