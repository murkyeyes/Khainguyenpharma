"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form
      action="/search"
      className="relative w-full max-w-[550px] lg:w-80 xl:w-full flex items-center group"
    >
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder="Tìm kiếm sản phẩm..."
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 pl-11 text-md text-black placeholder:text-gray-500 shadow-sm transition-all duration-300 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder:text-gray-400"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-500">
        <MagnifyingGlassIcon className="h-5 w-5" />
      </div>
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 p-2 text-white transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
      </button>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="relative w-full max-w-[550px] lg:w-80 xl:w-full flex items-center">
      <input
        placeholder="Tìm kiếm sản phẩm..."
        disabled
        className="w-full animate-pulse rounded-full border border-gray-200 bg-gray-100 px-4 py-2.5 pl-11 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
    </form>
  );
}
