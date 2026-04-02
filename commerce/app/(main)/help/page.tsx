import Footer from "components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Trợ Giúp - Khải Nguyên Pharma",
  description: "Trung tâm hỗ trợ Khải Nguyên Pharma. Câu hỏi thường gặp và liên hệ hỗ trợ.",
};

const supportCategories = [
  {
    title: "Hỗ Trợ Sản Phẩm",
    items: [
      { label: "Thông tin sản phẩm", href: "/search" },
      { label: "Hướng dẫn sử dụng", href: "#" },
      { label: "Báo cáo sản phẩm lỗi", href: "/contact" },
      { label: "Chứng nhận chất lượng", href: "#" },
    ],
  },
  {
    title: "Dịch Vụ Khải Nguyên",
    items: [
      { label: "Tư vấn dược phẩm", href: "/services" },
      { label: "Phân phối sỉ/lẻ", href: "/services" },
      { label: "Bảo hành thiết bị", href: "/services" },
      { label: "Dịch vụ chuyên nghiệp", href: "/services" },
    ],
  },
  {
    title: "Hỗ Trợ Đặt Hàng",
    items: [
      { label: "Kiểm tra trạng thái đơn hàng", href: "#" },
      { label: "Chính sách đổi trả", href: "#" },
      { label: "Hướng dẫn đặt hàng", href: "/search" },
      { label: "Báo giá & Hợp đồng", href: "/contact" },
    ],
  },
];

const faqs = [
  { q: "Làm sao để liên hệ chăm sóc khách hàng?", href: "/contact" },
  { q: "Chính sách đổi trả sản phẩm như thế nào?", href: "#" },
  { q: "Tôi muốn hợp tác phân phối, liên hệ ở đâu?", href: "/contact" },
  { q: "Thời gian giao hàng bao lâu?", href: "#" },
];

const learnMore = [
  { label: "Tin tức & Blog", href: "/blog" },
  { label: "Dịch vụ của chúng tôi", href: "/services" },
  { label: "Về Khải Nguyên Pharma", href: "/about-us" },
  { label: "Cơ hội nghề nghiệp", href: "/careers" },
];

export default function HelpPage() {
  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-br from-[#0d1b4a] to-[#1a3a7a] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Khải Nguyên Pharma</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Trợ Giúp</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Hỗ Trợ Khách Hàng</h1>
          <p className="text-blue-200 text-lg">Chúng tôi có thể giúp gì cho bạn?</p>
        </div>
      </section>

      {/* Support Categories - 3 Column Cards */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {supportCategories.map((cat) => (
              <div key={cat.title} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">{cat.title}</h3>
                <ul className="space-y-3">
                  {cat.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 hover:underline transition-colors">
                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + Learn More */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10">
            {/* FAQ */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Câu Hỏi Thường Gặp</h3>
              <ul className="space-y-3">
                {faqs.map((faq) => (
                  <li key={faq.q}>
                    <Link href={faq.href} className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 hover:underline transition-colors">
                      <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      {faq.q}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="inline-block mt-5 text-sm font-bold text-[#1a3a7a] hover:underline">
                Xem Tất Cả &gt;
              </Link>
            </div>

            {/* Learn More */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Tìm Hiểu Thêm</h3>
              <ul className="space-y-3">
                {learnMore.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 hover:underline transition-colors">
                      <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Create Account */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-[#0d1b4a] py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-2">Bạn chưa có tài khoản?</h3>
            <p className="text-blue-200">Tạo tài khoản ngay hôm nay để theo dõi đơn hàng, xem lịch sử mua hàng và nhận ưu đãi đặc biệt.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Quyền lợi tài khoản</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Theo dõi trạng thái đơn hàng</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Xem lịch sử mua hàng</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Nhận ưu đãi và khuyến mãi</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cần hỗ trợ thêm?</h2>
          <p className="text-gray-600 text-sm mb-8">Điền thông tin bên dưới, chuyên gia sẽ liên hệ lại bạn.</p>
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
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số điện thoại *</label>
                <input type="tel" className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nội dung *</label>
              <textarea rows={4} className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"></textarea>
            </div>
            <button type="submit" className="bg-[#1a3a7a] hover:bg-[#0d1b4a] text-white font-bold px-10 py-3 rounded transition-colors uppercase tracking-wider text-sm">
              Gửi Yêu Cầu
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
