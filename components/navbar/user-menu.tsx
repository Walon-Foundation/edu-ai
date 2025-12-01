"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface UserMenuProps {
  isProfileOpen: boolean;
  setIsProfileOpen: (isOpen: boolean) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export function UserMenu({
  isProfileOpen,
  setIsProfileOpen,
  setIsLoggedIn,
}: UserMenuProps) {
  const { user } = useUser();
  const clerk = useClerk();
  const router = useRouter();

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleSignOut = async () => {
    try {
      await clerk.signOut();
      setIsLoggedIn(false);
      setIsProfileOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    if (firstName || lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return user.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase() || "U";
  };

  const getUserName = () => {
    if (!user) return "User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.username || "User";
  };

  return (
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
            <svg
              className="w-4 h-4"
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
      )}
    </div>
  );
}
