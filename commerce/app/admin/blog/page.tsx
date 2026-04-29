"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://khainguyenpharma.onrender.com";

interface BlogPost {
  id: string;
  title: string;
  handle: string;
  category: string;
  summary: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/api/admin/blog`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/api/admin/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Xóa thất bại");
      }
    } catch {
      alert("Lỗi kết nối");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Blog</h1>
          <p className="text-gray-600 mt-1">
            Tổng cộng {posts.length} bài viết
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition inline-flex items-center"
        >
          <span className="mr-2">➕</span>
          Thêm bài viết
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Chưa có bài viết nào. Nhấn &quot;Thêm bài viết&quot; để bắt
                  đầu.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-2xl">
                        📝
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 line-clamp-2">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {post.published ? "Đã đăng" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
