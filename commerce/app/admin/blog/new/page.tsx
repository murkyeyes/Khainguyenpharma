"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "components/rich-text-editor";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://khainguyenpharma.onrender.com";

const CATEGORIES = ["Kiến Thức", "Dược Phẩm", "Thiết Bị Y Tế", "Tin Công Ty"];

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Kiến Thức",
    summary: "",
    content: "",
    published: true,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

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

  const uploadEditorImage = async (file: File): Promise<string> => {
    const token = localStorage.getItem("admin_token");
    const body = new FormData();
    body.append("image", file);

    const res = await fetch(`${API_URL}/api/admin/blog/content-images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Upload ảnh nội dung thất bại");
    }

    const data = await res.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

      const res = await fetch(`${API_URL}/api/admin/blog`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Tạo bài viết thất bại");
      }

      alert("Tạo bài viết thành công!");
      router.push("/admin/blog");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thêm bài viết mới</h1>
        <p className="text-gray-600 mt-1">
          Điền thông tin bài viết và upload ảnh đại diện
        </p>
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
            placeholder="Tiêu đề bài viết"
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
            placeholder="Tóm tắt ngắn gọn nội dung bài viết"
          />
        </div>

        {/* Content */}
        <RichTextEditor
          label="Nội dung bài viết"
          value={formData.content}
          onChange={(html) => setFormData({ ...formData, content: html })}
          placeholder="Nhập nội dung bài viết như Facebook..."
          onUploadImage={uploadEditorImage}
          uploadButtonId="blog-new-content-image"
        />

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

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh đại diện
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
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF lên đến 5MB
            </p>
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
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang tạo..." : "Tạo bài viết"}
          </button>
        </div>
      </form>
    </div>
  );
}
