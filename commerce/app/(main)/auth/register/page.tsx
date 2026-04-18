'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khainguyenpharma.onrender.com';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Sau khi đăng ký thành công → hiển thị màn hình "check email"
  const [registeredEmail, setRegisteredEmail] = useState('');

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

      // Thành công → Hiển thị màn thông báo "kiểm tra email"
      setRegisteredEmail(form.email);
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Màn hình "Check Your Email" ───────────────────────────────────────────
  if (registeredEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 py-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md mx-4">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 overflow-hidden text-center">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-5">
              <h1 className="text-white text-xl font-bold">Kiểm tra Email của bạn</h1>
              <p className="text-teal-100 text-sm mt-1">Chỉ còn một bước cuối!</p>
            </div>

            <div className="px-8 py-8">
              {/* Icon envelope */}
              <div className="w-20 h-20 bg-teal-50 border-4 border-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Tài khoản đã được khởi tạo! 🎉
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Chúng tôi đã gửi một <strong className="text-teal-600">liên kết kích hoạt</strong> đến:
              </p>

              <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-5">
                <p className="text-teal-800 font-semibold text-sm break-all">{registeredEmail}</p>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Nhấn vào liên kết trong email để kích hoạt tài khoản.<br />
                Liên kết có hiệu lực trong <strong>24 giờ</strong>.
              </p>

              {/* Checklist */}
              <div className="text-left bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Không thấy email?</p>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-teal-500 mt-0.5">✓</span>
                  <span>Kiểm tra thư mục <strong>Spam / Junk</strong></span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-teal-500 mt-0.5">✓</span>
                  <span>Đảm bảo email đã nhập đúng chính tả</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-teal-500 mt-0.5">✓</span>
                  <span>Chờ 1-2 phút để email đến</span>
                </div>
              </div>

              <Link
                href="/auth/login"
                className="inline-block w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition text-sm text-center"
              >
                Quay về Đăng nhập
              </Link>
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

  // ─── Form Đăng Ký ──────────────────────────────────────────────────────────
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
                    id="reg-fullname"
                    type="text" required value={form.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                  <input
                    id="reg-email"
                    type="email" required value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Mật khẩu *</label>
                  <input
                    id="reg-password"
                    type="password" required value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Xác nhận MK *</label>
                  <input
                    id="reg-confirm-password"
                    type="password" required value={form.confirmPassword}
                    onChange={(e) => set('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Số điện thoại</label>
                  <input
                    id="reg-phone"
                    type="tel" value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="0901234567"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Địa chỉ</label>
                  <input
                    id="reg-address"
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
                id="reg-submit"
                type="submit" disabled={loading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition disabled:opacity-50 shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Đang đăng ký...
                  </span>
                ) : 'Tạo tài khoản'}
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
