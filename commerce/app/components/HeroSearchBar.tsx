'use client';

import Form from 'next/form';
import { useSearchParams } from 'next/navigation';

export function HeroSearchBar() {
  const searchParams = useSearchParams();

  return (
    <Form
      action="/search"
      className="w-full max-w-2xl mx-auto flex items-center shadow-lg"
    >
      <input
        key={searchParams?.get('q')}
        type="text"
        name="q"
        placeholder="Tìm kiếm sản phẩm..."
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="flex-1 px-6 py-4 text-lg border-2 border-gray-200 rounded-l-lg focus:outline-none focus:border-green-500 bg-white"
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-bold px-10 py-4 text-lg rounded-r-lg transition-colors duration-200"
      >
        GO
      </button>
    </Form>
  );
}
