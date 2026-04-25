'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khainguyenpharma.onrender.com';

function formatPrice(amount: number | string) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
}

const statusMap: Record<string, { label: string, color: string, description: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', description: 'Đơn hàng của bạn đã được tiếp nhận và đang chờ xử lý.' },
  processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', description: 'Đơn hàng đang được đóng gói và chuẩn bị giao.' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800', description: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển.' },
  completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', description: 'Đơn hàng đã được giao thành công.' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', description: 'Đơn hàng đã bị hủy.' },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    
    if (!token) {
      router.replace(`/auth/login?redirect=/orders/${id}`);
      return;
    }
    
    fetchOrderDetails(token, id);
  }, [router, id]);

  const fetchOrderDetails = async (token: string, orderId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      } else {
        setError('Không tìm thấy đơn hàng hoặc bạn không có quyền xem đơn hàng này.');
      }
    } catch {
      setError('Lỗi kết nối khi tải chi tiết đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-red-500 mb-4">{error}</div>
        <Link href="/orders" className="text-teal-600 hover:text-teal-700 font-medium">
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const statusInfo = statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800', description: 'Trạng thái đơn hàng không xác định.' };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/orders" className="text-gray-500 hover:text-teal-600 transition">
            ← Quay lại
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng {order.id.slice(0, 8).toUpperCase()}</h1>
        </div>

        <div className="space-y-6">
          {/* Status Alert */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Trạng thái: <span className={statusInfo.color + ' px-2 py-0.5 rounded text-sm ml-2'}>{statusInfo.label}</span></h2>
              <p className="text-gray-500 text-sm">{statusInfo.description}</p>
            </div>
            <div className="text-sm text-gray-400 font-medium">
              Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Delivery Info */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Thông tin nhận hàng</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Địa chỉ</span>
                    <p className="font-medium text-gray-900">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Số điện thoại</span>
                    <p className="font-medium text-gray-900">{order.phone}</p>
                  </div>
                  {order.note && (
                    <div>
                      <span className="text-gray-500 block mb-1">Ghi chú</span>
                      <p className="text-gray-800 italic">{order.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                  <h3 className="font-semibold text-gray-900">Sản phẩm đã đặt</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {(order.items || []).map((item: any) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.productImage ? (
                          <Image src={item.productImage} alt={item.productTitle} width={80} height={80} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.productHandle}`} className="font-medium text-gray-900 hover:text-teal-600 transition block mb-1">
                          {item.productTitle}
                        </Link>
                        <p className="text-sm text-gray-500">Giá: {formatPrice(item.price)}</p>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right sm:w-32 flex-shrink-0 mt-2 sm:mt-0">
                        <p className="font-semibold text-teal-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Total */}
                <div className="bg-gray-50 p-6 border-t border-gray-100">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-900">Tổng cộng</span>
                    <span className="font-bold text-teal-600 text-xl">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}