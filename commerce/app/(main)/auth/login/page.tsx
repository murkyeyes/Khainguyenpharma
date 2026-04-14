"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://khainguyenpharma.onrender.com";

type Role = "customer" | "admin";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [role, setRole] = useState<Role>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Nếu đã đăng nhập, redirect
  useEffect(() => {
    const token =
      localStorage.getItem("user_token") || localStorage.getItem("admin_token");
    const userRole = localStorage.getItem("user_role");
    if (token) {
      if (userRole === "admin") router.replace("/admin/dashboard");
      else router.replace(redirect);
    }
  }, [router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Đăng nhập thất bại");
        return;
      }

      const userRole = data.user.role;

      // Kiểm tra role phù hợp với tab đang chọn
      if (role === "admin" && userRole !== "admin") {
        setError("Tài khoản này không có quyền quản trị");
        return;
      }
      if (role === "customer" && userRole === "admin") {
        setError('Vui lòng dùng tab "Quản trị viên" để đăng nhập admin');
        return;
      }

      // Lưu token và thông tin user
      localStorage.setItem("user_role", userRole);
      localStorage.setItem("user_info", JSON.stringify(data.user));

      if (userRole === "admin") {
        localStorage.setItem("admin_token", data.token);
        router.replace("/admin/dashboard");
      } else {
        localStorage.setItem("user_token", data.token);
        router.replace(redirect !== "/" ? redirect : "/");
      }
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white/20 rounded-full p-2">
                <Image
                  src="https://khainguyenpharma.onrender.com/uploads/products/logo.png"
                  alt="KXN Pharma"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain brightness-0 invert"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
            <h1 className="text-white text-xl font-bold">Khải Nguyên Pharma</h1>
            <p className="text-teal-100 text-sm mt-1">
              Hệ thống quản lý & mua sắm
            </p>
          </div>

          {/* Role Tabs — kiểu Đại học */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setRole("customer");
                setError("");
              }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                role === "customer"
                  ? "bg-teal-50 text-teal-700 border-b-2 border-teal-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">🛍️</span>
              Khách hàng
            </button>
            <button
              onClick={() => {
                setRole("admin");
                setError("");
              }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                role === "admin"
                  ? "bg-teal-50 text-teal-700 border-b-2 border-teal-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">🔐</span>
              Quản trị viên
            </button>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            {/* Info banner per role */}
            <div
              className={`rounded-lg px-4 py-2.5 mb-5 text-sm flex items-center gap-2 ${
                role === "customer"
                  ? "bg-teal-50 text-teal-700 border border-teal-100"
                  : "bg-amber-50 text-amber-700 border border-amber-100"
              }`}
            >
              {role === "customer" ? (
                <>
                  <span>👤</span>
                  <span>Đăng nhập để mua hàng và theo dõi đơn hàng</span>
                </>
              ) : (
                <>
                  <span>⚠️</span>
                  <span>Chỉ dành cho quản trị viên hệ thống</span>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                  <span>❌</span> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Đang đăng nhập...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>

            {/* Footer links */}
            {role === "customer" && (
              <div className="mt-5 pt-5 border-t border-gray-100 text-center">
                <span className="text-sm text-gray-500">
                  Chưa có tài khoản?{" "}
                </span>
                <Link
                  href="/auth/register"
                  className="text-sm text-teal-600 font-semibold hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Back to store */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-teal-600 transition"
          >
            ← Quay về trang mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Đang tải...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
