'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khainguyenpharma.onrender.com';

type VerifyState = 'loading' | 'success' | 'already' | 'expired' | 'invalid' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [state, setState] = useState<VerifyState>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setState('invalid');
      setMessage('Liên kết xác minh không hợp lệ. Vui lòng kiểm tra lại email của bạn.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok) {
          if (data.alreadyVerified) {
            setState('already');
            setMessage(data.message);
          } else {
            setState('success');
            setMessage(data.message || 'Tài khoản đã được kích hoạt thành công!');
          }
        } else if (res.status === 410 || data.expired) {
          setState('expired');
          setMessage(data.error || 'Liên kết xác minh đã hết hạn.');
        } else if (res.status === 404) {
          setState('invalid');
          setMessage(data.error || 'Liên kết xác minh không hợp lệ hoặc đã được sử dụng.');
        } else {
          setState('error');
          setMessage(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        }
      } catch {
        setState('error');
        setMessage('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
      }
    };

    verify();
  }, [token]);

  // Đếm ngược 5 giây rồi redirect về trang đăng nhập (chỉ khi thành công)
  useEffect(() => {
    if (state !== 'success') return;

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.replace('/auth/login');
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 py-10">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-5 text-center">
            <p className="text-teal-100 text-xs font-medium tracking-widest uppercase mb-1">Khai Nguyên Pharma</p>
            <h1 className="text-white text-xl font-bold">Xác minh tài khoản</h1>
          </div>

          <div className="px-8 py-10 text-center">

            {/* ── LOADING ── */}
            {state === 'loading' && (
              <div className="flex flex-col items-center gap-5">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-teal-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
                  <div className="absolute inset-3 rounded-full bg-teal-50 flex items-center justify-center">
                    <svg className="w-7 h-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Đang xác minh...</p>
                  <p className="text-sm text-gray-400 mt-1">Vui lòng chờ trong giây lát</p>
                </div>
              </div>
            )}

            {/* ── SUCCESS ── */}
            {state === 'success' && (
              <div className="flex flex-col items-center gap-5">
                <div className="w-20 h-20 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Xác minh thành công! 🎉</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                </div>

                {/* Countdown */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-3 w-full">
                  <p className="text-emerald-700 text-sm font-medium">
                    Tự động chuyển đến trang đăng nhập sau{' '}
                    <span className="font-bold text-emerald-600 text-base">{countdown}</span>s
                  </p>
                </div>

                <Link
                  href="/auth/login"
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-xl transition shadow-md shadow-teal-200 text-sm text-center block"
                >
                  🛍️ Đăng nhập &amp; Mua sắm ngay
                </Link>
              </div>
            )}

            {/* ── ALREADY VERIFIED ── */}
            {state === 'already' && (
              <div className="flex flex-col items-center gap-5">
                <div className="w-20 h-20 bg-blue-50 border-4 border-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Đã xác minh trước đó</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                </div>
                <Link
                  href="/auth/login"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition text-sm text-center block"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            )}

            {/* ── EXPIRED ── */}
            {state === 'expired' && (
              <div className="flex flex-col items-center gap-5">
                <div className="w-20 h-20 bg-amber-50 border-4 border-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Liên kết đã hết hạn ⏱️</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                </div>
                <div className="w-full space-y-2">
                  <Link
                    href="/auth/register"
                    className="block w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition text-sm text-center"
                  >
                    Đăng ký lại tài khoản mới
                  </Link>
                  <Link
                    href="/auth/login"
                    className="block w-full py-3 border border-gray-300 hover:border-teal-400 text-gray-600 hover:text-teal-600 font-medium rounded-xl transition text-sm text-center"
                  >
                    Thử đăng nhập
                  </Link>
                </div>
              </div>
            )}

            {/* ── INVALID / ERROR ── */}
            {(state === 'invalid' || state === 'error') && (
              <div className="flex flex-col items-center gap-5">
                <div className="w-20 h-20 bg-red-50 border-4 border-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {state === 'invalid' ? 'Liên kết không hợp lệ ❌' : 'Đã xảy ra lỗi ❌'}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                </div>
                <div className="w-full space-y-2">
                  <Link
                    href="/auth/register"
                    className="block w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition text-sm text-center"
                  >
                    Đăng ký tài khoản mới
                  </Link>
                  <Link
                    href="/"
                    className="block w-full py-3 border border-gray-300 hover:border-teal-400 text-gray-600 hover:text-teal-600 font-medium rounded-xl transition text-sm text-center"
                  >
                    ← Về trang mua sắm
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-teal-600 transition">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100" />
            <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
