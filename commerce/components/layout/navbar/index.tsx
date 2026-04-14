import CartModal from "components/cart/modal";
import Image from "next/image";
import { getMenu } from "lib/api";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";
import dynamic from "next/dynamic";

const UserMenu = dynamic(() => import("./user-menu"), { ssr: false });

const { SITE_NAME, NEXT_PUBLIC_BACKEND_URL } = process.env;
const backendUrl = NEXT_PUBLIC_BACKEND_URL || "https://khainguyenpharma.onrender.com";

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <>
      {/* Main Navbar - Pall Corporation Style */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                prefetch={true}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <Image
                  src={`${backendUrl}/uploads/products/logo.png`}
                  alt={SITE_NAME || "Khải Nguyên Pharma"}
                  width={200}
                  height={50}
                  className="h-10 md:h-12 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {menu.length
                ? menu.map((item: Menu) => (
                    <Link
                      key={item.title}
                      href={item.path}
                      prefetch={true}
                      className="text-gray-700 hover:text-blue-600 uppercase font-medium text-sm"
                    >
                      {item.title}
                    </Link>
                  ))
                : null}
              <Link
                href="/blog"
                className="text-gray-700 hover:text-blue-600 uppercase font-medium text-sm"
              >
                BLOG
              </Link>
              <Link
                href="/about-us"
                className="text-gray-700 hover:text-blue-600 uppercase font-medium text-sm"
              >
                GIỚI THIỆU
              </Link>
            </div>

            {/* Search Bar - Center */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <Suspense fallback={<SearchSkeleton />}>
                <Search />
              </Suspense>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <UserMenu />
              <Link
                href="/contact"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded text-sm hidden lg:block transition-colors"
              >
                Yêu Cầu Báo Giá
              </Link>
              <CartModal />
            </div>

            {/* Mobile Menu */}
            <div className="block md:hidden">
              <Suspense fallback={null}>
                <MobileMenu menu={menu} />
              </Suspense>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation Bar - About, Careers, Contact, etc */}
      <div className="bg-blue-700 border-b border-blue-800 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-6 text-sm">
              <Link href="/about-us" className="text-white hover:text-blue-200 transition-colors">Giới Thiệu</Link>
              <Link href="/careers" className="text-white hover:text-blue-200 transition-colors">Tuyển Dụng</Link>
              <Link href="/contact" className="text-white hover:text-blue-200 transition-colors">Liên Hệ</Link>
              <Link href="/search" className="text-white hover:text-blue-200 transition-colors">Sản Phẩm</Link>
              <Link href="/services" className="text-white hover:text-blue-200 transition-colors">Dịch Vụ</Link>
              <Link href="/help" className="text-white hover:text-blue-200 transition-colors">Trợ Giúp</Link>
            </div>
            <div className="text-white text-sm">
              📞 HOTLINE: 0779 085 855
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
