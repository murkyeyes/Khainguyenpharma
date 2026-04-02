import Footer from "components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Liên Hệ - Khải Nguyên Pharma",
  description: "Liên hệ Công ty TNHH Dược phẩm - Thiết bị y tế Khải Nguyên để được tư vấn và hỗ trợ.",
};

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Hero Banner - Pall Style */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-br from-[#0d1b4a] to-[#1a3a7a] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Khải Nguyên Pharma</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Liên Hệ</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Liên Hệ</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Bạn có câu hỏi? Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ và tư vấn tốt nhất cho bạn.
          </p>
        </div>
      </section>

      {/* Main Content - Form + Sidebar */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Form - Left 2 cols */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Kết Nối Với Chuyên Gia</h2>
              <form className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ *</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên *</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input type="email" className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Công ty / Tổ chức</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số điện thoại *</label>
                    <input type="tel" className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lĩnh vực *</label>
                    <select className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Chọn lĩnh vực...</option>
                      <option>Nhà thuốc</option>
                      <option>Bệnh viện / Phòng khám</option>
                      <option>Quầy thuốc</option>
                      <option>Công ty phân phối</option>
                      <option>Khác</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bạn cần hỗ trợ gì? *</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                    <option value="">Chọn...</option>
                    <option>Tư vấn sản phẩm</option>
                    <option>Báo giá</option>
                    <option>Hợp tác kinh doanh</option>
                    <option>Khiếu nại / Phản hồi</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nội dung chi tiết *</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"></textarea>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="consent" className="mt-1" />
                  <label htmlFor="consent" className="text-xs text-gray-500">
                    Tôi đồng ý nhận thông tin về sản phẩm và dịch vụ từ Khải Nguyên Pharma qua email hoặc điện thoại.
                  </label>
                </div>
                <button type="submit" className="bg-[#1a3a7a] hover:bg-[#0d1b4a] text-white font-bold px-10 py-3 rounded transition-colors uppercase tracking-wider text-sm">
                  Gửi Yêu Cầu
                </button>
              </form>
            </div>

            {/* Sidebar - Right 1 col */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3">Cần hỗ trợ thêm?</h3>
                <p className="text-sm text-gray-600 mb-4">Gọi trực tiếp cho đội ngũ chăm sóc khách hàng.</p>
                <Link href="tel:0779085855" className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-green-700 transition-colors text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Gọi Ngay
                </Link>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Tài Nguyên Hữu Ích</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Câu hỏi thường gặp</p>
                      <Link href="/help" className="text-sm text-blue-600 hover:underline">Xem FAQ →</Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Địa chỉ văn phòng</p>
                      <p className="text-xs text-gray-500">Phòng 4, Tòa nhà KASATI, 270A Lý Thường Kiệt, P.14, Q.10, TP.HCM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Customer Service */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Liên Hệ Chăm Sóc Khách Hàng</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-3xl mx-auto">
            <div className="flex">
              <button className="px-6 py-3 text-sm font-bold bg-white text-gray-900 border-b-2 border-[#1a3a7a]">Miền Nam</button>
              <button className="px-6 py-3 text-sm font-bold bg-green-600 text-white">Miền Trung</button>
              <button className="px-6 py-3 text-sm font-bold bg-green-600 text-white">Miền Bắc</button>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 font-medium text-gray-700">TP. Hồ Chí Minh</td>
                  <td className="px-6 py-3 text-gray-600">0779 085 855</td>
                  <td className="px-6 py-3 text-gray-500">Tất cả sản phẩm</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 font-medium text-gray-700">Zalo Hỗ Trợ</td>
                  <td className="px-6 py-3 text-gray-600">0911 093 064</td>
                  <td className="px-6 py-3 text-gray-500">Tư vấn & Đặt hàng</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-gray-700">Email</td>
                  <td className="px-6 py-3 text-blue-600">contact@khainguyen.com</td>
                  <td className="px-6 py-3 text-gray-500">Hợp tác kinh doanh</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Request Quote Banner */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-green-700 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white">
            <h3 className="text-xl font-bold">Yêu Cầu Báo Giá</h3>
            <p className="text-green-100">Cần báo giá? Gửi yêu cầu trực tuyến, chúng tôi sẽ phản hồi trong 24h.</p>
          </div>
          <Link href="/search" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg">
            <span>Yêu Cầu Báo Giá</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
