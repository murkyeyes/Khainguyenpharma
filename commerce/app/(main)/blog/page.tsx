"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://khainguyenpharma.onrender.com";

const CATEGORIES = [
  "Tất cả",
  "Kiến Thức",
  "Dược Phẩm",
  "Thiết Bị Y Tế",
  "Tin Công Ty",
];

const categoryColors: Record<string, string> = {
  "Kiến Thức": "bg-blue-700",
  "Dược Phẩm": "bg-green-700",
  "Thiết Bị Y Tế": "bg-purple-700",
  "Tin Công Ty": "bg-orange-700",
};

interface BlogPost {
  id: string;
  title: string;
  handle: string;
  category: string;
  summary: string;
  imageUrl: string | null;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      const categoryParam =
        selectedCategory === "Tất cả"
          ? ""
          : `?category=${encodeURIComponent(selectedCategory)}`;
      const res = await fetch(`${API_URL}/api/blog${categoryParam}`);
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

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-br from-[#0d1b4a] to-[#1a3a7a] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Khải Nguyên Pharma
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Blog</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Blog Khải Nguyên Pharma
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Khám phá các bài viết, tin tức và kiến thức y dược hữu ích. Chọn chủ
            đề bạn quan tâm bên dưới.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700">Danh mục</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-green-600 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-green-400 outline-none bg-white min-w-[160px]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">{posts.length} bài viết</p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl mb-2">Chưa có bài viết nào</p>
              <p className="text-sm">Hãy quay lại sau nhé!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <div
                    className={`${categoryColors[post.category] || "bg-gray-700"} h-48 flex items-center justify-center relative overflow-hidden`}
                  >
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <svg
                        className="w-16 h-16 text-white/30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs font-bold px-2.5 py-1 rounded z-10">
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#1a3a7a] transition-colors min-h-[48px] line-clamp-2">
                      {post.title}
                    </h3>
                    {post.summary && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {post.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/blog/${post.handle}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-[#1a3a7a] hover:underline uppercase tracking-wider"
                      >
                        Đọc Thêm
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                      <span className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
