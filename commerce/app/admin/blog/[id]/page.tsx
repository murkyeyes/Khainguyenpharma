"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://khainguyenpharma.onrender.com";

const CATEGORIES = ["Kiến Thức", "Dược Phẩm", "Thiết Bị Y Tế", "Tin Công Ty"];

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Kiến Thức",
    summary: "",
    content: "",
    published: true,
  });
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      // Fetch from admin endpoint to get unpublished posts too
      const res = await fetch(`${API_URL}/api/admin/blog`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const post = (data.posts || []).find((p: any) => p.id === postId);
        if (post) {
          setFormData({
            title: post.title,
            category: post.category,
            summary: post.summary || "",
            content: post.content || "",
            published: post.published,
          });
          setCurrentImageUrl(post.imageUrl);
        } else {
          alert("Không tìm thấy bài viết");
          router.push("/admin/blog");
        }
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File vượt quá 5MB");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("admin_token");
      const body = new FormData();
      body.append("title", formData.title);
      body.append("category", formData.category);
      body.append("summary", formData.summary);
      body.append("content", formData.content);
      body.append("published", String(formData.published));
      if (selectedImage) {
        body.append("image", selectedImage);
      }

      const res = await fetch(`${API_URL}/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Cập nhật thất bại");
      }

      alert("Cập nhật bài viết thành công!");
      router.push("/admin/blog");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
        <p className="text-gray-600 mt-1">{formData.title}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tóm tắt
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung (HTML)
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>

        {/* Published */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) =>
              setFormData({ ...formData, published: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="published"
            className="ml-2 block text-sm text-gray-900"
          >
            Đăng ngay (công khai)
          </label>
        </div>

        {/* Current Image */}
        {currentImageUrl && !imagePreview && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh hiện tại
            </label>
            <img
              src={currentImageUrl}
              alt="Current"
              className="h-48 w-auto object-cover rounded-lg"
            />
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentImageUrl ? "Thay đổi ảnh đại diện" : "Ảnh đại diện"}
          </label>
          <div className="mt-2">
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 w-auto object-cover rounded-lg"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
