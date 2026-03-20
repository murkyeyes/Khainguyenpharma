import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";
import Image from "next/image";
import Link from "next/link";
import { CategoryItem } from "./components/CategoryItem";
import { RippleText } from "./components/RippleText";

export const metadata = {
  title: "Khải Nguyên Pharma - Dược phẩm uy tín",
  description:
    "Công ty TNHH Dược phẩm - Thiết bị y tế Khải Nguyên. Cung cấp dược phẩm chất lượng cao.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  
  return (
    <div className="w-full">
      {/* Hero Banner with Overlay */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] h-auto">
        <div className="relative w-full aspect-[21/9] md:aspect-[16/6] lg:aspect-[21/7]">
          <Image
            src={`${backendUrl}/uploads/products/slideshow_1.jpg`}
            alt="Khải Nguyên Pharma Banner"
            fill
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white z-10 px-4 py-8">
              <RippleText 
                as="h1" 
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-2xl border-2 border-white/30 rounded-2xl px-6 md:px-8 py-3 md:py-4 inline-block backdrop-blur-sm bg-white/5"
              >
                Sức khỏe, Được chăm sóc
              </RippleText>
              <div className="mt-4 md:mt-6">
                <Link 
                  href="/search"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base rounded-md transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
                >
                  Xem Tất Cả Sản Phẩm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="relative -mt-20 z-20">
        <div className="container mx-auto px-4">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-xl border border-white/40 p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <CategoryItem href="/search/giam-dau-ha-sot" icon="💊" label="Giảm Đau & Hạ Sốt" />
              <CategoryItem href="/search/vitamin-bo-sung" icon="🍊" label="Vitamin & TPBVSK" />
              <CategoryItem href="/search" icon="🩺" label="Thiết Bị Y Tế" />
              <CategoryItem href="/search" icon="👶" label="Sản Phẩm Trẻ Em" />
              <CategoryItem href="/search" icon="💄" label="Chăm Sóc Sắc Đẹp" />
              <CategoryItem href="/search" icon="🌿" label="Dược Liệu Tự Nhiên" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Solutions - 3 Columns */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-blue-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={`${backendUrl}/uploads/products/logo.png`}
                  alt="Sản phẩm chất lượng"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Sản Phẩm Chất Lượng Cao
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Cam kết cung cấp dược phẩm và thiết bị y tế chính hãng, có nguồn gốc rõ ràng, đảm bảo chất lượng theo tiêu chuẩn quốc tế.
                </p>
                <Link href="/search" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold group-hover:gap-3 transition-all">
                  Tìm hiểu thêm
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-blue-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={`${backendUrl}/uploads/products/logo.png`}
                  alt="Tư vấn chuyên nghiệp"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Tư Vấn Chuyên Nghiệp
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Đội ngũ dược sĩ giàu kinh nghiệm luôn sẵn sàng tư vấn và hỗ trợ khách hàng lựa chọn sản phẩm phù hợp với nhu cầu sức khỏe.
                </p>
                <Link href="/about-us" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold group-hover:gap-3 transition-all">
                  Liên hệ tư vấn
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-blue-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={`${backendUrl}/uploads/products/logo.png`}
                  alt="Giao hàng nhanh chóng"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Giao Hàng Toàn Quốc
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Miễn phí vận chuyển nội thành HCM. Giao hàng nhanh chóng toàn quốc với đối tác vận chuyển uy tín, đảm bảo sản phẩm nguyên vẹn.
                </p>
                <Link href="/search" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold group-hover:gap-3 transition-all">
                  Xem chính sách
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">
              Đồng Hành Cùng Sức Khỏe Việt
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Từ năm 2016, Khải Nguyên Pharma đã không ngừng nỗ lực mang đến những sản phẩm 
              dược phẩm và thiết bị y tế chất lượng cao, góp phần nâng cao sức khỏe cộng đồng. 
              Chúng tôi hợp tác với các đối tác uy tín trong và ngoài nước để cung cấp 
              giải pháp toàn diện cho mọi nhu cầu chăm sóc sức khỏe.
            </p>
          </div>

          {/* 2x2 Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quality */}
            <Link href="/search" className="relative h-80 rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src={`${backendUrl}/uploads/products/slideshow_1.jpg`}
                alt="Chất lượng"
                fill
                className="object-cover brightness-75 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-blue-900/70 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded mb-3 group-hover:bg-blue-500 transition-colors">
                  CHẤT LƯỢNG
                </span>
                <h3 className="text-2xl font-bold group-hover:text-3xl transition-all duration-300">Cam Kết Chất Lượng</h3>
              </div>
            </Link>

            {/* Vision */}
            <Link href="/about-us" className="relative h-80 rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src={`${backendUrl}/uploads/products/slideshow_1.jpg`}
                alt="Tầm nhìn"
                fill
                className="object-cover brightness-75 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-blue-900/70 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded mb-3 group-hover:bg-blue-500 transition-colors">
                  TẦM NHÌN & SỨ MỆNH
                </span>
                <h3 className="text-2xl font-bold group-hover:text-3xl transition-all duration-300">Vì Sức Khỏe Cộng Đồng</h3>
              </div>
            </Link>

            {/* Blog */}
            <Link href="/search" className="relative h-80 rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src={`${backendUrl}/uploads/products/slideshow_1.jpg`}
                alt="Blog"
                fill
                className="object-cover brightness-75 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-blue-900/70 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded mb-3 group-hover:bg-blue-500 transition-colors">
                  BLOG
                </span>
                <h3 className="text-2xl font-bold group-hover:text-3xl transition-all duration-300">Kiến Thức Sức Khỏe</h3>
              </div>
            </Link>

            {/* News */}
            <Link href="/search" className="relative h-80 rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src={`${backendUrl}/uploads/products/slideshow_1.jpg`}
                alt="Tin tức"
                fill
                className="object-cover brightness-75 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-blue-900/70 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded mb-3 group-hover:bg-blue-500 transition-colors">
                  TIN TỨC
                </span>
                <h3 className="text-2xl font-bold group-hover:text-3xl transition-all duration-300">Cập Nhật Mới Nhất</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Bar */}
      <section className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <span className="text-3xl">⚕️</span>
            <div className="text-center md:text-left">
              <p className="text-sm md:text-base font-semibold mb-1">
                📍 Phòng 4, Tòa nhà KASATI, số 270A (hẻm 354) Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM
              </p>
              <p className="text-sm md:text-base">
                📞 Liên hệ: <span className="font-bold">0911 093 064</span> | 📧 Email: contact@khainguyen.com
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
