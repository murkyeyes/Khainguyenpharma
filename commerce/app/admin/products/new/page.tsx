'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    handle: '',
    title: '',
    description: '',
    descriptionHtml: '',
    priceAmount: '',
    priceCurrency: 'VND',
    availableForSale: true,
    collectionIds: [] as string[], // gửi handle, backend sẽ tự tra UUID
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('https://khainguyenpharma.onrender.com/api/collections');
      const data = await response.json();
      setCollections(data.collections || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');

      // 1. Create product
      const productResponse = await fetch('https://khainguyenpharma.onrender.com/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!productResponse.ok) {
        const error = await productResponse.json();
        throw new Error(error.error || 'Tạo sản phẩm thất bại');
      }

      const productData = await productResponse.json();
      const productHandle = productData.product.handle;

      // 2. Upload image if selected
      if (selectedImage) {
        setUploadingImage(true);
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        imageFormData.append('imageType', 'main');
        imageFormData.append('altText', formData.title);

        const imageResponse = await fetch(
          `https://khainguyenpharma.onrender.com/api/admin/products/${productHandle}/images`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: imageFormData,
          }
        );

        if (!imageResponse.ok) {
          console.error('Image upload failed, but product created');
        }
      }

      alert('Tạo sản phẩm thành công!');
      router.push('/admin/products');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const handleCollectionToggle = (collectionHandle: string) => {
    setFormData((prev) => ({
      ...prev,
      collectionIds: prev.collectionIds.includes(collectionHandle)
        ? prev.collectionIds.filter((h) => h !== collectionHandle)
        : [...prev.collectionIds, collectionHandle],
    }));
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
        <p className="text-gray-600 mt-1">Điền thông tin sản phẩm và upload ảnh</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Handle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Handle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.handle}
            onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="vi-du-san-pham"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL-friendly identifier (ví dụ: amvitacine-150)
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amvitacine 150mg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả ngắn
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mô tả ngắn gọn về sản phẩm"
          />
        </div>

        {/* Description HTML */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả chi tiết (HTML)
          </label>
          <textarea
            value={formData.descriptionHtml}
            onChange={(e) => setFormData({ ...formData, descriptionHtml: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="<p>Mô tả chi tiết với HTML...</p>"
          />
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.priceAmount}
              onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="150000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đơn vị tiền tệ
            </label>
            <select
              value={formData.priceCurrency}
              onChange={(e) => setFormData({ ...formData, priceCurrency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* Available for Sale */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="availableForSale"
            checked={formData.availableForSale}
            onChange={(e) => setFormData({ ...formData, availableForSale: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="availableForSale" className="ml-2 block text-sm text-gray-900">
            Còn hàng
          </label>
        </div>

        {/* Collections */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collections
          </label>
          <div className="space-y-2">
            {collections.map((collection) => (
              <div key={collection.handle} className="flex items-center">
                <input
                  type="checkbox"
                  id={`collection-${collection.handle}`}
                  checked={formData.collectionIds.includes(collection.handle)}
                  onChange={() => handleCollectionToggle(collection.handle)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`collection-${collection.handle}`} className="ml-2 block text-sm text-gray-900">
                  {collection.title}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh sản phẩm
          </label>
          <div className="mt-2">
            {imagePreview && (
              <div className="mb-4">
                <img src={imagePreview} alt="Preview" className="h-48 w-48 object-cover rounded-lg" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF lên đến 5MB</p>
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
            disabled={loading || uploadingImage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (uploadingImage ? 'Đang upload ảnh...' : 'Đang tạo...') : 'Tạo sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}
