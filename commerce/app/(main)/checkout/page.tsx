'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khainguyenpharma.onrender.com';

function formatPrice(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    shippingAddress: '',
    phone: '',
    note: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      router.replace('/auth/login?redirect=/checkout');
      return;
    }
    fetchCart(token);
    // Pre-fill từ user info
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    if (userInfo.address) setForm(f => ({ ...f, shippingAddress: userInfo.address }));
    if (userInfo.phone) setForm(f => ({ ...f, phone: userInfo.phone }));
  }, [router]);

  const fetchCart = async (token: string) => {
    try {
      // Lấy cart của user qua user_id trong token
      // Frontend cần biết cartId — tạo/lấy cart của user
      const res = await fetch(`${API_URL}/api/cart/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      }
    } catch {
      setError('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shippingAddress || !form.phone) {
      setError('Vui lòng nhập đầy đủ địa chỉ và số điện thoại');
      return;
    }

    setSubmitting(true);
    setError('');
    const token = localStorage.getItem('user_token');

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Đặt hàng thất bại');
        return;
      }

      setSuccess(data.order.id);
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  // Màn hình thành công
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="text-center max-w-md mx-4">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Đặt hàng thành công!</h1>
          <p className="text-gray-600 mb-2">Cảm ơn bạn đã tin tưởng Khải Nguyên Pharma.</p>
          <p className="text-sm text-gray-500 mb-6">
            Mã đơn hàng: <span className="font-mono text-teal-600">{success.slice(0, 8).toUpperCase()}</span>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/orders" className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition">
              Xem đơn hàng
            </Link>
            <Link href="/" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lines = cart?.lines || [];
  const totalAmount = lines.reduce(
    (s: number, l: any) => s + parseFloat(l.cost?.totalAmount?.amount || 0), 0
  );

  if (lines.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
          <Link href="/" className="text-teal-600 hover:underline">← Quay về mua sắm</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Thanh toán</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giao hàng</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ giao hàng *
                  </label>
                  <textarea
                    required rows={3}
                    value={form.shippingAddress}
                    onChange={(e) => setForm(f => ({ ...f, shippingAddress: e.target.value }))}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel" required
                    value={form.phone}
                    onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="0901234567"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú (tuỳ chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={form.note}
                    onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))}
                    placeholder="Ghi chú cho đơn hàng..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    ❌ {error}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-700">
                  💳 Hình thức thanh toán: <strong>Thanh toán khi nhận hàng (COD)</strong>
                </div>

                <button
                  type="submit" disabled={submitting}
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition disabled:opacity-50 shadow-sm text-base"
                >
                  {submitting ? '⏳ Đang xử lý...' : `✅ Xác nhận đặt hàng — ${formatPrice(totalAmount)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Đơn hàng ({lines.length} sản phẩm)
              </h2>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {lines.map((line: any) => (
                  <div key={line.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                    {line.merchandise.product.featuredImage?.url ? (
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.title}
                        width={50} height={50}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {line.merchandise.product.title}
                      </p>
                      <p className="text-xs text-gray-500">SL: {line.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-teal-600 flex-shrink-0">
                      {formatPrice(parseFloat(line.cost.totalAmount.amount))}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Tổng cộng</span>
                  <span className="font-bold text-xl text-teal-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
