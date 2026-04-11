'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    handle: '',
    title: '',
    description: '',
    descriptionHtml: '',
    priceAmount: '',
    priceCurrency: 'VND',
    availableForSale: true,
    collectionIds: [] as number[],
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [currentImages, setCurrentImages] = useState<any[]>([]);

  useEffect(() => {
    fetchCollections();
    fetchProduct();
  }, [productId]);

  const fetchCollections = async () => {
    try {
      const response = await fetch('https://khainguyenpharma.onrender.com/api/collections');
      const data = await response.json();
      setCollections(data.collections || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`https://khainguyenpharma.onrender.com/api/products/${productId}`);
      const data = await response.json();
      
      setProduct(data.product);
      setFormData({
        handle: data.product.handle,
        title: data.product.title,
        description: data.product.description || '',
        descriptionHtml: data.product.descriptionHtml || '',
        priceAmount: data.product.priceRange.maxVariantPrice.amount,
        priceCurrency: data.product.priceRange.maxVariantPrice.currencyCode,
        availableForSale: data.product.availableForSale,
        collectionIds: data.product.collections?.map((c: any) => c.id) || [],
      });
      setCurrentImages(data.product.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Không tìm thấy sản phẩm');
      router.push('/admin/products');
    } finally {
      setLoading(false);
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
    setSaving(true);

    try {
      const token = localStorage.getItem('admin_token');

      // 1. Update product
      const productResponse = await fetch(`https://khainguyenpharma.onrender.com/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!productResponse.ok) {
        const error = await productResponse.json();
        throw new Error(error.error || 'Cập nhật sản phẩm thất bại');
      }

      // 2. Upload new image if selected
      if (selectedImage) {
        setUploadingImage(true);
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        imageFormData.append('imageType', 'main');
        imageFormData.append('altText', formData.title);

        const imageResponse = await fetch(
          `https://khainguyenpharma.onrender.com/api/admin/products/${formData.handle}/images`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: imageFormData,
          }
        );

        if (!imageResponse.ok) {
          console.error('Image upload failed, but product updated');
        }
      }

      alert('Cập nhật sản phẩm thành công!');
      router.push('/admin/products');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  const handleCollectionToggle = (collectionId: number) => {
    setFormData((prev) => ({
      ...prev,
      collectionIds: prev.collectionIds.includes(collectionId)
        ? prev.collectionIds.filter((id) => id !== collectionId)
        : [...prev.collectionIds, collectionId],
    }));
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
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
        <p className="text-gray-600 mt-1">{product?.title}</p>
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
          />
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
              <div key={collection.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`collection-${collection.id}`}
                  checked={formData.collectionIds.includes(collection.id)}
                  onChange={() => handleCollectionToggle(collection.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`collection-${collection.id}`} className="ml-2 block text-sm text-gray-900">
                  {collection.title}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Current Images */}
        {currentImages.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh hiện tại
            </label>
            <div className="flex gap-4">
              {currentImages.map((img, idx) => (
                <img key={idx} src={img.url} alt={img.altText} className="h-32 w-32 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {/* Upload New Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload hình ảnh mới
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
            disabled={saving || uploadingImage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (uploadingImage ? 'Đang upload ảnh...' : 'Đang lưu...') : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}
