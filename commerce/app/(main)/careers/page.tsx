import Footer from "components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Tuyển Dụng - Khải Nguyên Pharma",
  description: "Cơ hội nghề nghiệp tại Công ty TNHH Dược phẩm - Thiết bị y tế Khải Nguyên.",
};

const jobCategories = [
  {
    title: "Kinh doanh",
    icon: (
      <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    ),
    link: "#sales",
    bg: "from-blue-700 to-blue-900"
  },
  {
    title: "Dược sĩ",
    icon: (
      <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    ),
    link: "#pharma",
    bg: "from-green-600 to-green-800"
  },
  {
    title: "Kho vận & Hậu cần",
    icon: (
      <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    ),
    link: "#logistics",
    bg: "from-purple-600 to-purple-800"
  },
];

const workAreas = [
  {
    title: "Dược phẩm",
    desc: "Phân phối các sản phẩm dược phẩm từ kháng sinh, thuốc giảm đau đến vitamin cho hệ thống nhà thuốc và bệnh viện trên toàn quốc."
  },
  {
    title: "Thiết bị y tế",
    desc: "Cung cấp thiết bị y tế, vật tư tiêu hao cho phòng khám, bệnh viện với cam kết chất lượng và giá cả cạnh tranh."
  },
  {
    title: "Chăm sóc sức khỏe",
    desc: "Phát triển các giải pháp chăm sóc sức khỏe toàn diện, từ tư vấn sử dụng thuốc đến cung cấp sản phẩm dinh dưỡng."
  },
  {
    title: "Công nghệ",
    desc: "Ứng dụng công nghệ vào quản lý kho, phân phối và chăm sóc khách hàng để nâng cao hiệu quả và trải nghiệm."
  },
];

export default function CareersPage() {
  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-br from-[#0d1b4a] to-[#1a3a7a] text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Khải Nguyên Pharma</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Tuyển Dụng</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Tuyển Dụng tại Khải Nguyên Pharma</h1>
          <p className="text-blue-200 text-lg max-w-3xl">
            Nơi bạn có thể phát triển sự nghiệp và đóng góp cho sức khỏe cộng đồng. Đội ngũ chúng tôi khuyến khích sáng tạo, đổi mới và hợp tác.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-700 leading-relaxed text-[15px]">
            Tại Khải Nguyên Pharma, chúng tôi tin rằng con người là tài sản quý giá nhất. Với sứ mệnh mang đến giải pháp dược phẩm chất lượng cao, chúng tôi cần những đồng đội tài năng, nhiệt huyết và sẵn sàng tạo ra sự khác biệt trong ngành y tế.
          </p>
        </div>
      </section>

      {/* Job Category Cards */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {jobCategories.map((cat) => (
              <a key={cat.title} href={cat.link} className="group block">
                <div className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br ${cat.bg} shadow-md hover:shadow-xl transition-shadow`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                    {cat.icon}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/30 px-5 py-4">
                    <span className="text-white font-bold text-lg">{cat.title}</span>
                  </div>
                </div>
                <p className="mt-3 text-center text-blue-700 font-semibold text-sm group-hover:underline">
                  Vị trí {cat.title} →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Our Work */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lĩnh vực hoạt động</h2>
          <div className="w-20 h-1 bg-[#1a3a7a] mb-10"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workAreas.map((area) => (
              <div key={area.title}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{area.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-green-700 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-2">Tham Gia Đội Ngũ Khải Nguyên</h3>
            <p className="text-green-100">Gửi CV của bạn ngay hôm nay. Nhận cập nhật về các vị trí tuyển dụng mới.</p>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg">
            <span>Ứng Tuyển Ngay</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Đam mê đổi mới</h3>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                Tại Khải Nguyên Pharma, bạn sẽ được khuyến khích sáng tạo và đổi mới. Chúng tôi luôn tìm kiếm những giải pháp mới để phục vụ khách hàng tốt hơn và nâng cao chất lượng dịch vụ.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Phát triển cùng nhau</h3>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                Chúng tôi đề cao tinh thần đồng đội và sự hòa nhập. Mỗi thành viên đều mang đến góc nhìn và kinh nghiệm riêng, góp phần xây dựng văn hóa công ty đa dạng và năng động.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Connect */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Kết nối với chúng tôi:</h3>
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
