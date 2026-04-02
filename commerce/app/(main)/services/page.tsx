import Footer from "components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Dịch Vụ - Khải Nguyên Pharma",
  description: "Khám phá các dịch vụ của Khải Nguyên Pharma: phân phối dược phẩm, tư vấn sản phẩm, và hỗ trợ kỹ thuật.",
};

const services = [
  {
    title: "Phân Phối Dược Phẩm",
    desc: "Hệ thống phân phối dược phẩm chuyên nghiệp, đảm bảo nguồn cung ổn định và chất lượng sản phẩm từ các nhà sản xuất uy tín.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    ),
    color: "bg-blue-700",
  },
  {
    title: "Tư Vấn Sản Phẩm",
    desc: "Đội ngũ dược sĩ giàu kinh nghiệm sẵn sàng tư vấn về cách sử dụng, liều lượng và tương tác thuốc cho khách hàng.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    ),
    color: "bg-green-600",
  },
  {
    title: "Hỗ Trợ Đặt Hàng",
    desc: "Quy trình đặt hàng đơn giản, nhanh chóng. Hỗ trợ theo dõi đơn hàng và giao hàng tận nơi trên toàn quốc.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
    ),
    color: "bg-purple-600",
  },
  {
    title: "Bảo Hành & Bảo Trì",
    desc: "Chế độ bảo hành, bảo trì cho thiết bị y tế. Đội ngũ kỹ thuật viên chuyên nghiệp sẵn sàng hỗ trợ nhanh chóng.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
    color: "bg-orange-600",
  },
];

export default function ServicesPage() {
  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-br from-[#0d1b4a] to-[#1a3a7a] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Khải Nguyên Pharma</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Dịch Vụ</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Dịch Vụ Khải Nguyên Pharma</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Phục vụ nhu cầu dược phẩm và thiết bị y tế của bạn
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gray-700 text-[15px] leading-relaxed">
            Đội ngũ Khải Nguyên Pharma cung cấp chuyên môn và dịch vụ hàng đầu để giải quyết mọi thách thức của bạn. 
            Chúng tôi đáp ứng nhu cầu trong các lĩnh vực: Nhà thuốc, Bệnh viện, Phòng khám, Quầy thuốc và Công ty phân phối.
          </p>
        </div>
      </section>

      {/* Services Grid - Pall Style */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#1a3a7a] mb-8">Khám Phá Dịch Vụ:</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => (
              <div key={svc.title} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                <div className={`${svc.color} h-40 flex items-center justify-center`}>
                  <div className="opacity-60 group-hover:opacity-90 transition-opacity transform group-hover:scale-110">
                    {svc.icon}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#1a3a7a] mb-2">{svc.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{svc.desc}</p>
                  <Link href="/contact" className="inline-flex items-center gap-1 bg-[#1a3a7a] text-white text-xs font-bold px-4 py-2 rounded hover:bg-[#0d1b4a] transition-colors">
                    Tìm Hiểu Thêm
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Regional */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thông Tin Liên Hệ Dịch Vụ</h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex">
                  <button className="px-5 py-2.5 text-sm font-bold bg-white text-gray-900 border-b-2 border-[#1a3a7a]">Miền Nam</button>
                  <button className="px-5 py-2.5 text-sm font-bold bg-green-600 text-white">Miền Trung</button>
                  <button className="px-5 py-2.5 text-sm font-bold bg-green-600 text-white">Miền Bắc</button>
                </div>
                <div className="p-6 space-y-3 text-sm">
                  <p><strong>Email:</strong> <a href="mailto:contact@khainguyen.com" className="text-blue-600 hover:underline">contact@khainguyen.com</a></p>
                  <p><strong>Điện thoại:</strong> 0779 085 855</p>
                  <p><strong>Zalo:</strong> 0911 093 064</p>
                  <p><strong>Địa chỉ:</strong> Phòng 4, Tòa nhà KASATI, 270A Lý Thường Kiệt, P.14, Q.10, TP.HCM</p>
                </div>
              </div>
            </div>

            {/* Contact Form Sidebar */}
            <div className="bg-[#1a3a7a] rounded-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-5">Liên Hệ Dịch Vụ</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1">Bạn cần hỗ trợ gì? *</label>
                  <select className="w-full border border-blue-400 bg-blue-900/50 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-green-400 outline-none">
                    <option>Chọn...</option>
                    <option>Phân phối dược phẩm</option>
                    <option>Tư vấn sản phẩm</option>
                    <option>Bảo hành thiết bị</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1">Họ tên *</label>
                  <input type="text" className="w-full border border-blue-400 bg-blue-900/50 rounded px-3 py-2 text-sm text-white placeholder-blue-300 focus:ring-2 focus:ring-green-400 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1">Email *</label>
                  <input type="email" className="w-full border border-blue-400 bg-blue-900/50 rounded px-3 py-2 text-sm text-white placeholder-blue-300 focus:ring-2 focus:ring-green-400 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1">Công ty</label>
                  <input type="text" className="w-full border border-blue-400 bg-blue-900/50 rounded px-3 py-2 text-sm text-white placeholder-blue-300 focus:ring-2 focus:ring-green-400 outline-none" />
                </div>
                <button type="submit" className="w-full bg-white text-[#1a3a7a] font-bold py-2.5 rounded hover:bg-gray-100 transition-colors text-sm">
                  Gửi Yêu Cầu
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
