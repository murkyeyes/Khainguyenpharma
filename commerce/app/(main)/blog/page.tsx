import Footer from "components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Blog - Khải Nguyên Pharma",
  description: "Tin tức, bài viết và chia sẻ kiến thức y dược từ Khải Nguyên Pharma.",
};

const blogPosts = [
  {
    title: "Hướng Dẫn Bảo Quản Thuốc Đúng Cách Tại Nhà",
    category: "Kiến Thức",
    readTime: "5 phút",
    color: "bg-blue-700",
  },
  {
    title: "Top 10 Kháng Sinh Phổ Biến Nhất Tại Việt Nam",
    category: "Dược Phẩm",
    readTime: "7 phút",
    color: "bg-green-700",
  },
  {
    title: "Thiết Bị Y Tế: Xu Hướng Mới 2024-2025",
    category: "Thiết Bị Y Tế",
    readTime: "6 phút",
    color: "bg-purple-700",
  },
  {
    title: "Khải Nguyên Pharma Mở Rộng Mạng Lưới Phân Phối",
    category: "Tin Công Ty",
    readTime: "4 phút",
    color: "bg-orange-700",
  },
  {
    title: "Cách Chọn Vitamin Phù Hợp Cho Từng Độ Tuổi",
    category: "Kiến Thức",
    readTime: "5 phút",
    color: "bg-teal-700",
  },
  {
    title: "Quy Trình Kiểm Soát Chất Lượng Dược Phẩm",
    category: "Dược Phẩm",
    readTime: "8 phút",
    color: "bg-indigo-700",
  },
  {
    title: "Tầm Quan Trọng Của Thuốc Giảm Đau Trong Y Khoa",
    category: "Kiến Thức",
    readTime: "6 phút",
    color: "bg-rose-700",
  },
  {
    title: "Hợp Tác Quốc Tế Trong Ngành Dược Phẩm",
    category: "Tin Công Ty",
    readTime: "5 phút",
    color: "bg-cyan-700",
  },
  {
    title: "An Toàn Sử Dụng Thuốc Cho Trẻ Em",
    category: "Kiến Thức",
    readTime: "7 phút",
    color: "bg-amber-700",
  },
];

export default function BlogPage() {
  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-br from-[#0d1b4a] to-[#1a3a7a] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Khải Nguyên Pharma</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Blog</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Blog Khải Nguyên Pharma</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Khám phá các bài viết, tin tức và kiến thức y dược hữu ích. Chọn chủ đề bạn quan tâm bên dưới.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700">Danh mục</span>
              <select className="border border-green-600 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-green-400 outline-none bg-white min-w-[160px]">
                <option>Tất cả</option>
                <option>Kiến Thức</option>
                <option>Dược Phẩm</option>
                <option>Thiết Bị Y Tế</option>
                <option>Tin Công Ty</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700">Sắp xếp</span>
              <select className="border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white min-w-[160px]">
                <option>Mới nhất</option>
                <option>Phổ biến nhất</option>
                <option>Cũ nhất</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">{blogPosts.length} bài viết</p>
        </div>
      </section>

      {/* Blog Grid - Pall Style */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <article key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Image Placeholder */}
                <div className={`${post.color} h-48 flex items-center justify-center relative`}>
                  <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs font-bold px-2.5 py-1 rounded">{post.category}</span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-4 leading-snug group-hover:text-[#1a3a7a] transition-colors min-h-[48px]">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <Link href="#" className="inline-flex items-center gap-1 text-sm font-bold text-[#1a3a7a] hover:underline uppercase tracking-wider">
                      Đọc Thêm
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </Link>
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="pb-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50">&lt;</button>
            <button className="w-9 h-9 flex items-center justify-center border-2 border-[#1a3a7a] rounded text-sm font-bold text-[#1a3a7a]">1</button>
            <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">2</button>
            <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">10</button>
            <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50">&gt;</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
