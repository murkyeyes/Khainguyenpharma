"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://khainguyenpharma.onrender.com";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [newOrderToast, setNewOrderToast] = useState(false);
  const [lastChecked, setLastChecked] = useState(new Date().toISOString());

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("admin_token");
    // Hỗ trợ cả 2 key: user_info (mới) và admin_user (cũ)
    const userData =
      localStorage.getItem("user_info") || localStorage.getItem("admin_user");

    if (!token || !userData) {
      if (pathname !== "/admin/login") router.push("/admin/login");
      setLoading(false);
      return;
    }
    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        if (pathname !== "/admin/login") router.push("/admin/login");
        setLoading(false);
        return;
      }
      setUser(parsedUser);
    } catch {
      if (pathname !== "/admin/login") router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router, pathname]);

  // Polling đơn hàng mới mỗi 30 giây
  const pollOrders = useCallback(async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    try {
      const res = await fetch(
        `${API_URL}/api/admin/orders/stats?since=${lastChecked}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.ok) {
        const data = await res.json();
        setPendingOrders(data.pendingCount || 0);
        if (data.newOrdersSince > 0) setNewOrderToast(true);
        setLastChecked(data.checkedAt);
      }
    } catch {
      /* ignore */
    }
  }, [lastChecked]);

  useEffect(() => {
    const interval = setInterval(pollOrders, 30000);
    return () => clearInterval(interval);
  }, [pollOrders]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("user_info");
    localStorage.removeItem("user_role");
    router.push("/auth/login");
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Sản phẩm", href: "/admin/products", icon: "📦" },
    { name: "Collections", href: "/admin/collections", icon: "📁" },
    {
      name: "Đơn hàng",
      href: "/admin/orders",
      icon: "🛒",
      badge: pendingOrders,
    },
    { name: "Blog", href: "/admin/blog", icon: "📝" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-gray-800">
          <h1 className="text-xl font-bold">Khải Nguyên Admin</h1>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {user.fullName?.charAt(0) || "A"}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item: any) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
                {item.badge > 0 && (
                  <span className="ml-auto bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition"
          >
            <span className="mr-3 text-xl">🚪</span>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {navigation.find((item) => pathname.startsWith(item.href))
                  ?.name || "Admin Panel"}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        {newOrderToast && (
          <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
            <span className="text-lg">🔔</span>
            <span className="font-semibold">Có đơn hàng mới!</span>
            <button
              onClick={() => setNewOrderToast(false)}
              className="ml-2 text-green-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
