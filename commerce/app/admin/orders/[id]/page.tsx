'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khainguyenpharma.onrender.com';

const STATUS_OPTIONS = [
  { value: 'pending', label: '⏳ Chờ xử lý', color: 'text-yellow-600' },
  { value: 'confirmed', label: '✅ Đã xác nhận', color: 'text-blue-600' },
  { value: 'shipping', label: '🚚 Đang giao', color: 'text-purple-600' },
  { value: 'delivered', label: '📦 Đã giao', color: 'text-green-600' },
  { value: 'cancelled', label: '❌ Đã hủy', color: 'text-red-600' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipping: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setNewStatus(data.order.status);
      }
    } catch {
      console.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === order.status) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrder((prev: any) => ({ ...prev, status: newStatus }));
        setSuccessMsg(data.message);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      console.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Không tìm thấy đơn hàng</p>
        <Link href="/admin/orders" className="text-blue-600 hover:underline mt-2 block">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const currentStatusOption = STATUS_OPTIONS.find(s => s.value === order.status);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="text-gray-500 hover:text-gray-700 transition">
          ← Quay lại
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Đơn hàng #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-gray-500 text-sm">
            {new Date(order.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>
        <span className={`ml-auto inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${STATUS_COLORS[order.status]}`}>
          {currentStatusOption?.label || order.status}
        </span>
      </div>

      {successMsg && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 font-medium">
          ✅ {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left — Thông tin + Sản phẩm */}
        <div className="md:col-span-2 space-y-4">
          {/* Thông tin khách */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              👤 Thông tin khách hàng
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Họ tên</p>
                <p className="font-medium text-gray-900">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Email</p>
                <p className="font-medium text-gray-900">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">SĐT đặt hàng</p>
                <p className="font-medium text-gray-900">{order.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">SĐT tài khoản</p>
                <p className="font-medium text-gray-900">{order.customer.phone || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 text-xs mb-0.5">Địa chỉ giao hàng</p>
                <p className="font-medium text-gray-900">{order.shippingAddress}</p>
              </div>
              {order.note && (
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs mb-0.5">Ghi chú</p>
                  <p className="text-gray-700 italic">{order.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🛍️ Sản phẩm đã mua
            </h2>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productTitle}
                      width={60} height={60}
                      className="rounded-lg object-cover flex-shrink-0 border border-gray-200"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400">
                      📦
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{item.productTitle}</p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-teal-600 text-sm flex-shrink-0">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">Tổng cộng</span>
              <span className="font-bold text-xl text-teal-600">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Right — Update status */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">🔄 Cập nhật trạng thái</h2>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    newStatus === opt.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={newStatus === opt.value}
                    onChange={() => setNewStatus(opt.value)}
                    className="text-blue-600"
                  />
                  <span className={`text-sm font-medium ${newStatus === opt.value ? 'text-blue-700' : opt.color}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || newStatus === order.status}
              className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {updating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
