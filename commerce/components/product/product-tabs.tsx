'use client';

import { useState } from 'react';

export function ProductTabs({ 
  description, 
  descriptionHtml 
}: { 
  description: string;
  descriptionHtml?: string;
}) {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'related'>('description');

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex-1 px-6 py-4 font-semibold transition-colors ${
            activeTab === 'description'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
          }`}
        >
          MÔ TẢ SẢN PHẨM
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 px-6 py-4 font-semibold transition-colors ${
            activeTab === 'reviews'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
          }`}
        >
          BÌNH LUẬN
        </button>
        <button
          onClick={() => setActiveTab('related')}
          className={`flex-1 px-6 py-4 font-semibold transition-colors ${
            activeTab === 'related'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
          }`}
        >
          SẢN PHẨM KHÁC
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            {descriptionHtml ? (
              <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>
                
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin sản phẩm</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Thành phần:</strong> Vui lòng xem trên bao bì sản phẩm</p>
                    <p className="whitespace-pre-wrap"><strong>Công dụng:</strong> {description}</p>
                    <p><strong>Hướng dẫn sử dụng:</strong> Theo chỉ định của bác sĩ hoặc dược sĩ</p>
                    <p><strong>Bảo quản:</strong> Nơi khô ráo, thoáng mát, tránh ánh sáng trực tiếp</p>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Thông tin trên website chỉ mang tính chất tham khảo. 
                    Vui lòng tham khảo ý kiến bác sĩ hoặc dược sĩ trước khi sử dụng.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center py-12">
            <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500 text-lg">Chưa có bình luận nào</p>
            <p className="text-gray-400 text-sm mt-2">Hãy là người đầu tiên đánh giá sản phẩm này</p>
          </div>
        )}

        {activeTab === 'related' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Xem thêm sản phẩm tương tự bên dưới</p>
          </div>
        )}
      </div>
    </div>
  );
}
