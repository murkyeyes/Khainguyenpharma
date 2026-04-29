"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://khainguyenpharma.onrender.com";

interface BlogPost {
  id: string;
  title: string;
  handle: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const handle = params.handle as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPost();
  }, [handle]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`${API_URL}/api/blog/${handle}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
      } else {
        setError("Không tìm thấy bài viết");
      }
    } catch {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-red-500 mb-4 text-lg">{error}</div>
        <Link
          href="/blog"
          className="text-[#1a3a7a] hover:underline font-medium"
        >
          ← Quay lại Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-br from-[#0d1b4a] to-[#1a3a7a] text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Khải Nguyên Pharma
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{post.category}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{post.title}</h1>
          <div className="flex items-center gap-4 text-blue-200 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span>
              {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          {/* Featured Image */}
          {post.imageUrl && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-md">
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Summary */}
          {post.summary && (
            <div className="mb-8 p-4 bg-blue-50 border-l-4 border-[#1a3a7a] rounded-r-lg">
              <p className="text-gray-700 italic">{post.summary}</p>
            </div>
          )}

          {/* Article Content */}
          <article
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#1a3a7a]"
            dangerouslySetInnerHTML={{
              __html: post.content || "<p>Chưa có nội dung.</p>",
            }}
          />

          {/* Back Link */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#1a3a7a] hover:underline font-medium"
            >
              ← Quay lại Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
