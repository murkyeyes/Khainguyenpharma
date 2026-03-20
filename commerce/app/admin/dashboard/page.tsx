'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCollections: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products count
      const productsRes = await fetch('http://localhost:3001/api/products');
      const productsData = await productsRes.json();
      
      // Fetch collections count
      const collectionsRes = await fetch('http://localhost:3001/api/collections');
      const collectionsData = await collectionsRes.json();

      // Fetch pages count
      const pagesRes = await fetch('http://localhost:3001/api/pages');
      const pagesData = await pagesRes.json();

      setStats({
        totalProducts: productsData.products?.length || 0,
        totalCollections: collectionsData.collections?.length || 0,
        totalPages: pagesData.pages?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const cards = [
    {
      title: 'Sản phẩm',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-blue-500',
      href: '/admin/products',
    },
    {
      title: 'Collections',
      value: stats.totalCollections,
      icon: '📁',
      color: 'bg-green-500',
      href: '/admin/collections',
    },
    {
      title: 'Trang',
      value: stats.totalPages,
      icon: '📄',
      color: 'bg-purple-500',
      href: '/admin/pages',
    },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Chào mừng đến Admin Panel 👋</h1>
        <p className="text-blue-100">Quản lý sản phẩm, collections và nội dung website</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} w-16 h-16 rounded-lg flex items-center justify-center text-3xl`}>
                {card.icon}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/products/new"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <span className="text-2xl mr-3">➕</span>
            <div>
              <p className="font-medium text-gray-900">Thêm sản phẩm mới</p>
              <p className="text-sm text-gray-600">Tạo sản phẩm mới và upload ảnh</p>
            </div>
          </a>

          <a
            href="/admin/products"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
          >
            <span className="text-2xl mr-3">✏️</span>
            <div>
              <p className="font-medium text-gray-900">Quản lý sản phẩm</p>
              <p className="text-sm text-gray-600">Sửa hoặc xóa sản phẩm hiện có</p>
            </div>
          </a>

          <a
            href="/"
            target="_blank"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
          >
            <span className="text-2xl mr-3">🌐</span>
            <div>
              <p className="font-medium text-gray-900">Xem website</p>
              <p className="text-sm text-gray-600">Mở trang chủ trong tab mới</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
