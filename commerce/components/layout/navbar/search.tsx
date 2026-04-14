"use client";

import { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("q") || "");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch products for client-side search
  useEffect(() => {
    // Tự động nhận diện môi trường để gọi đúng API
    const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const backendUrl = isLocal 
      ? 'http://localhost:3001' 
      : 'https://khainguyenpharma.onrender.com';
      
    fetch(`${backendUrl}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data && data.products) {
          setAllProducts(data.products);
        }
      })
      .catch((err) => console.error("Could not fetch products for autocomplete:", err));
  }, []);

  // Filter and Rank suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const lowerQuery = query.toLowerCase();

    const matches = allProducts.filter((p) =>
      p.title.toLowerCase().includes(lowerQuery)
    );

    matches.sort((a, b) => {
      // Ưu tiên cái nào có chữ gần ở đầu hơn
      const idxA = a.title.toLowerCase().indexOf(lowerQuery);
      const idxB = b.title.toLowerCase().indexOf(lowerQuery);
      if (idxA !== idxB) return idxA - idxB;
      // Dài tên sản phẩm để tie-break
      return a.title.length - b.title.length;
    });

    setSuggestions(matches.slice(0, 6)); // Hiện top 6 kết quả tốt nhất
  }, [query, allProducts]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[550px] lg:w-80 xl:w-full flex flex-col">
      <Form
        action="/search"
        className="relative w-full flex items-center rounded-sm bg-white p-1 shadow-sm border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-300 dark:bg-neutral-900 dark:border-neutral-700 dark:focus-within:border-blue-500"
      >
        <input
          type="text"
          name="q"
          placeholder="Tìm kiếm sản phẩm..."
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full bg-transparent px-3 py-1.5 text-md text-black placeholder:text-gray-500 focus:outline-none md:text-sm dark:text-white dark:placeholder:text-gray-400"
        />
        <button
          type="submit"
          aria-label="Search"
          className="flex h-8 w-14 shrink-0 items-center justify-center rounded-sm bg-blue-600 text-white transition-opacity hover:opacity-90 dark:bg-blue-600"
        >
          <MagnifyingGlassIcon className="h-5 w-5 stroke-[2]" />
        </button>
      </Form>

      {/* Auto-complete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-[38px] left-0 right-0 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 shadow-xl rounded-sm z-[100] max-h-[400px] overflow-y-auto">
          {suggestions.map((item) => (
            <Link
              key={item.handle}
              href={`/product/${item.handle}`}
              onClick={() => setShowDropdown(false)}
              className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors last:border-0"
            >
              <div className="w-10 h-10 shrink-0 bg-white border border-gray-200 rounded-sm overflow-hidden flex items-center justify-center">
                {item.featuredImage?.url ? (
                  <img src={item.featuredImage.url} alt={item.title} className="w-full h-full object-contain" />
                ) : (
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-300" />
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm text-black dark:text-white font-medium truncate">
                  {item.title}
                </span>
                <span className="text-xs font-semibold text-blue-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.priceRange?.minVariantPrice?.amount || 0)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Suggeted Keywords */}
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
        <Link href="/search/giam-dau-ha-sot" className="whitespace-nowrap hover:text-blue-600 transition-colors">Hạ Sốt</Link>
        <Link href="/search/vitamin-tpbvsk" className="whitespace-nowrap hover:text-blue-600 transition-colors">Vitamin</Link>
        <Link href="/search/thiet-bi-y-te" className="whitespace-nowrap hover:text-blue-600 transition-colors">Thiết Bị Y Tế</Link>
        <Link href="/search/san-pham-tre-em" className="whitespace-nowrap hover:text-blue-600 transition-colors hidden sm:block">Mẹ & Bé</Link>
        <Link href="/search/cham-soc-sac-dep" className="whitespace-nowrap hover:text-blue-600 transition-colors hidden md:block">Sắc Đẹp</Link>
        <Link href="/search/duoc-lieu-tu-nhien" className="whitespace-nowrap hover:text-blue-600 transition-colors hidden lg:block">Dược Liệu</Link>
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="relative w-full max-w-[550px] lg:w-80 xl:w-full flex flex-col">
      <form className="relative w-full flex items-center rounded-sm bg-white p-1 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
        <input
          placeholder="Tìm kiếm sản phẩm..."
          disabled
          className="w-full bg-transparent px-3 py-1.5 text-md md:text-sm text-black placeholder:text-gray-500 opacity-50 dark:text-white"
        />
        <div className="flex h-8 w-14 shrink-0 items-center justify-center rounded-sm bg-gray-200 dark:bg-neutral-800 animate-pulse">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 stroke-[2]" />
        </div>
      </form>
    </div>
  );
}
