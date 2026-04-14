'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khainguyenpharma.onrender.com';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      // 1. Đăng ký
      const registerRes = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
        }),
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        setError(registerData.error || 'Đăng ký thất bại');
        return;
      }

      // 2. Tự động login
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const loginData = await loginRes.json();
      if (loginRes.ok) {
        localStorage.setItem('user_token', loginData.token);
        localStorage.setItem('user_role', loginData.user.role);
        localStorage.setItem('user_info', JSON.stringify(loginData.user));
        router.replace('/');
      } else {
        router.replace('/auth/login');
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-5 text-center">
            <h1 className="text-white text-xl font-bold">Tạo tài khoản mới</h1>
            <p className="text-teal-100 text-sm mt-1">Đăng ký để mua hàng và theo dõi đơn</p>
          </div>

          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Họ và tên *</label>
                  <input
                    type="text" required value={form.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                  <input
                    type="email" required value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Mật khẩu *</label>
                  <input
                    type="password" required value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Xác nhận MK *</label>
                  <input
                    type="password" required value={form.confirmPassword}
                    onChange={(e) => set('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Số điện thoại</label>
                  <input
                    type="tel" value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="0901234567"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Địa chỉ</label>
                  <input
                    type="text" value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    placeholder="123 Đường ABC, Quận 1, TP.HCM"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <span className="text-sm text-gray-500">Đã có tài khoản? </span>
              <Link href="/auth/login" className="text-sm text-teal-600 font-semibold hover:underline">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-teal-600 transition">
            ← Quay về trang mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
