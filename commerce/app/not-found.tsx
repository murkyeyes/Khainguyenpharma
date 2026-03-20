export const runtime = 'edge';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Trang bạn tìm kiếm không tồn tại</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Có vẻ như liên kết này đã bị hỏng hoặc trang đã bị xóa. Vui lòng kiểm tra lại đường dẫn.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
      >
        Trở về trang chủ
      </Link>
    </div>
  );
}
