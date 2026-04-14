'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khainguyenpharma.onrender.com';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipping: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Chờ xử lý',
  confirmed: '✅ Đã xác nhận',
  shipping: '🚚 Đang giao',
  delivered: '📦 Đã giao',
  cancelled: '❌ Đã hủy',
};

function formatPrice(amount: string | number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [lastChecked, setLastChecked] = useState(new Date().toISOString());
  const [total, setTotal] = useState(0);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

  const fetchOrders = useCallback(async () => {
    try {
      const url = `${API_URL}/api/admin/orders${filterStatus ? `?status=${filterStatus}` : ''}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotal(data.total || 0);
      }
    } catch {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, token]);

  // Polling: check đơn mới mỗi 30 giây
  const pollNewOrders = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/orders/stats?since=${lastChecked}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setPendingCount(data.pendingCount || 0);
        if (data.newOrdersSince > 0) {
          setNewOrderAlert(true);
          fetchOrders(); // Auto-refresh list
        }
        setLastChecked(data.checkedAt);
      }
    } catch {
      // Bỏ qua lỗi polling
    }
  }, [lastChecked, token, fetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const interval = setInterval(pollNewOrders, 30000);
    return () => clearInterval(interval);
  }, [pollNewOrders]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng cộng {total} đơn hàng</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full px-3 py-1 text-sm font-semibold">
              ⏳ {pendingCount} đơn chờ
            </span>
          )}
          <button
            onClick={() => { fetchOrders(); setNewOrderAlert(false); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* New order alert */}
      {newOrderAlert && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="font-semibold">🔔 Có đơn hàng mới! Danh sách đã được cập nhật.</span>
          <button onClick={() => setNewOrderAlert(false)} className="text-green-500 hover:text-green-700">✕</button>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {[['', 'Tất cả'], ...Object.entries(STATUS_LABELS)].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilterStatus(val as string)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
              filterStatus === val
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-3">📋</div>
            <p>Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Mã đơn</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Khách hàng</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">SĐT</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">Tổng tiền</th>
                  <th className="text-center px-4 py-3 text-gray-600 font-semibold">Trạng thái</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Ngày đặt</th>
                  <th className="text-center px-4 py-3 text-gray-600 font-semibold">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-500">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-400">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.phone}</td>
                    <td className="px-4 py-3 text-right font-semibold text-teal-600">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
                      >
                        Xem →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
