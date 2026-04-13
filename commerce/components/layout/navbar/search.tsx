"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form
      action="/search"
      className="relative w-full max-w-[550px] lg:w-80 xl:w-full flex items-center rounded-sm bg-white p-1 shadow-sm border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-300 dark:bg-neutral-900 dark:border-neutral-700 dark:focus-within:border-blue-500"
    >
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder="Tìm kiếm sản phẩm..."
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
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
  );
}

export function SearchSkeleton() {
  return (
    <form className="relative w-full max-w-[550px] lg:w-80 xl:w-full flex items-center rounded-sm bg-white p-1 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
      <input
        placeholder="Tìm kiếm sản phẩm..."
        disabled
        className="w-full bg-transparent px-3 py-1.5 text-sm text-black placeholder:text-gray-500 opacity-50 dark:text-white"
      />
      <div className="flex h-8 w-14 shrink-0 items-center justify-center rounded-sm bg-gray-200 dark:bg-neutral-800 animate-pulse">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 stroke-[2]" />
      </div>
    </form>
  );
}
