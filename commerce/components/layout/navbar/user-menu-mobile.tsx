'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserMenuMobile({ closeMenu }: { closeMenu: () => void }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const userInfoStr = localStorage.getItem('user_info');
      const role = localStorage.getItem('user_role');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        setUserName(userInfo.name || userInfo.email?.split('@')[0] || 'Tài khoản');
      }
      if (role) {
        setUserRole(role);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('user_role');
    window.location.href = '/';
  };

  if (!mounted) return null;

  if (userName) {
    return (
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="px-2 text-xl font-semibold mb-4 flex items-center gap-2">
          <span>👤</span> {userName}
        </div>
        <ul className="flex w-full flex-col">
          {userRole === 'admin' ? (
            <li className="py-2 text-lg text-black transition-colors hover:text-blue-600">
              <Link href="/admin/dashboard" onClick={closeMenu}>
                ⚙️ Quản trị viên
              </Link>
            </li>
          ) : (
            <li className="py-2 text-lg text-black transition-colors hover:text-blue-600">
              <Link href="/auth/login" onClick={closeMenu}>
                📦 Đơn hàng của tôi
              </Link>
            </li>
          )}
          <li className="py-2 text-lg text-red-600 transition-colors hover:text-red-800">
            <button onClick={handleLogout} className="text-left w-full">
              🚪 Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <ul className="flex w-full flex-col">
        <li className="py-2 text-lg text-blue-600 font-semibold transition-colors hover:text-blue-800">
          <Link href="/auth/login" onClick={closeMenu}>
            Đăng nhập
          </Link>
        </li>
        <li className="py-2 text-lg text-blue-600 font-semibold transition-colors hover:text-blue-800">
          <Link href="/auth/register" onClick={closeMenu}>
            Đăng ký
          </Link>
        </li>
      </ul>
    </div>
  );
}