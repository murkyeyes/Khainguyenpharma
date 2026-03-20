"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form
      action="/search"
      className="w-max-[550px] relative w-full lg:w-80 xl:w-full flex items-center"
    >
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder="Tìm kiếm sản phẩm..."
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="text-md w-full rounded-l-md border border-gray-300 bg-white px-4 py-2.5 text-black placeholder:text-gray-400 md:text-sm focus:outline-none focus:border-green-500"
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded-r-md transition-colors duration-200"
      >
        GO
      </button>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full flex items-center">
      <input
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full rounded-l-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-black placeholder:text-gray-400"
      />
      <button
        type="button"
        className="bg-green-500 text-white font-bold px-6 py-2.5 rounded-r-md"
      >
        GO
      </button>
    </form>
  );
}
