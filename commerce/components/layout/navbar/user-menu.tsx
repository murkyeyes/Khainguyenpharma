"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function UserMenu() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const userInfoStr = localStorage.getItem("user_info");
      const role = localStorage.getItem("user_role");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          setUserName(userInfo.name || userInfo.email?.split("@")[0] || "Account");
        } catch (e) {
          console.error("Corrupted user_info, clearing storage", e);
          localStorage.removeItem("user_token");
          localStorage.removeItem("admin_token");
          localStorage.removeItem("user_info");
          localStorage.removeItem("user_role");
        }
      }
      if (role) {
        setUserRole(role);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("user_role");
    window.location.href = "/";
  };

  if (!mounted) {
    return (
      <div className="hidden lg:flex items-center gap-3 w-32 h-10 animate-pulse bg-gray-100 rounded">
      </div>
    );
  }

  if (userName) {
    return (
      <div className="group relative">
        <button className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm hidden lg:flex py-2">
          <span>O</span> {userName}
        </button>
        <div className="absolute right-0 top-full w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top group-hover:-translate-y-0.5">
          {userRole === "admin" ? (
            <Link 
              href="/admin/dashboard" 
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              # Admin
            </Link>
          ) : (
            <Link 
              href="/orders"
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              $ My Orders
            </Link>
          )}
          <div className="h-px bg-gray-100 w-full" />
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            x Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-3">
      <Link
        href="/auth/login"
        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
      >
        Sign in
      </Link>
      <span className="text-gray-300">|</span>
      <Link
        href="/auth/register"
        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
      >
        Sign up
      </Link>
    </div>
  );
}