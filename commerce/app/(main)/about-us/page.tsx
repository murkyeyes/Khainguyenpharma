import Footer from "components/layout/footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Giới Thiệu - Khải Nguyên Pharma",
  description:
    "Công ty TNHH Dược phẩm - Thiết bị y tế Khải Nguyên. Đồng hành cùng sức khỏe Việt từ năm 2016.",
};

export default function AboutUsPage() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://khainguyenpharma.onrender.com";

  return (
    <div className="w-full">
      {/* Hero Banner - Pall Style */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-br from-[#0d1b4a] to-[#1a3a7a] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Khải Nguyên Pharma
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Giới Thiệu</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Về Khải Nguyên Pharma
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Nơi chúng tôi cam kết mang đến giải pháp dược phẩm chất lượng cao.
            Đồng hành cùng sức khỏe cộng đồng Việt Nam.
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-700 leading-relaxed mb-5 text-[15px]">
                Công ty TNHH Dược phẩm - Thiết bị y tế Khải Nguyên được thành
                lập với sứ mệnh mang đến những sản phẩm dược phẩm và thiết bị y
                tế chất lượng cao cho cộng đồng. Từ những ngày đầu, chúng tôi đã
                luôn đặt lợi ích và sức khỏe của khách hàng lên hàng đầu.
              </p>
              <p className="text-gray-700 leading-relaxed mb-5 text-[15px]">
                Với đội ngũ dược sĩ giàu kinh nghiệm và hệ thống phân phối
                chuyên nghiệp, chúng tôi cam kết cung cấp các giải pháp chăm sóc
                sức khỏe toàn diện, đáp ứng mọi nhu cầu của khách hàng trên toàn
                quốc.
              </p>
              <p className="text-gray-700 leading-relaxed text-[15px]">
                Chúng tôi hợp tác với các đối tác trong và ngoài nước để đảm bảo
                nguồn cung ổn định, sản phẩm chính hãng, giá cả hợp lý.{" "}
                <strong>Sức khỏe của bạn, sứ mệnh của chúng tôi.</strong>
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={
                  "https://res.cloudinary.com/dsslvkccb/image/upload/v1777190512/khainguyen-pharma/static/logo.png"
                }
                alt="Khải Nguyên Pharma"
                fill
                className="object-contain bg-white p-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values - 3 Cards with Top Border */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border-t-4 border-[#1a3a7a] p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-[#1a3a7a]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sứ Mệnh</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Mang đến giải pháp chăm sóc sức khỏe toàn diện, chất lượng cao
                với giá cả hợp lý cho mọi người dân Việt Nam.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border-t-4 border-green-600 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tầm Nhìn</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Trở thành đơn vị phân phối dược phẩm và thiết bị y tế hàng đầu
                tại Việt Nam, là đối tác tin cậy của các bệnh viện và nhà thuốc.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border-t-4 border-orange-500 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Giá Trị Cốt Lõi
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Uy tín - Chất lượng - Tận tâm - Chuyên nghiệp. Luôn đặt lợi ích
                khách hàng lên hàng đầu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards - Pall Style Grid */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/contact"
              className="group relative block aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b4a]/90 via-[#0d1b4a]/40 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-blue-900/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-blue-200/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <span className="absolute bottom-0 left-0 right-0 z-20 p-3 text-white font-bold text-sm group-hover:text-green-300 transition-colors">
                Liên Hệ &gt;
              </span>
            </Link>
            <Link
              href="/careers"
              className="group relative block aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b4a]/90 via-[#0d1b4a]/40 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-green-900/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-green-200/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="absolute bottom-0 left-0 right-0 z-20 p-3 text-white font-bold text-sm group-hover:text-green-300 transition-colors">
                Tuyển Dụng &gt;
              </span>
            </Link>
            <Link
              href="/blog"
              className="group relative block aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b4a]/90 via-[#0d1b4a]/40 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-purple-900/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-purple-200/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <span className="absolute bottom-0 left-0 right-0 z-20 p-3 text-white font-bold text-sm group-hover:text-green-300 transition-colors">
                Blog &gt;
              </span>
            </Link>
            <Link
              href="/services"
              className="group relative block aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b4a]/90 via-[#0d1b4a]/40 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-teal-900/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-teal-200/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="absolute bottom-0 left-0 right-0 z-20 p-3 text-white font-bold text-sm group-hover:text-green-300 transition-colors">
                Dịch Vụ &gt;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-r from-[#0d1b4a] to-[#1a3a7a] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">8+</div>
              <div className="text-blue-200 text-sm">Năm Kinh Nghiệm</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200 text-sm">Sản Phẩm</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200 text-sm">Khách Hàng</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">63</div>
              <div className="text-blue-200 text-sm">Tỉnh Thành</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner - Green Pall Style */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-green-700 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white">
            <h3 className="text-xl font-bold">Bạn cần tư vấn?</h3>
            <p className="text-green-100">
              Liên hệ ngay để được hỗ trợ bởi đội ngũ chuyên gia của chúng tôi.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg"
          >
            <span>Liên Hệ Ngay</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
