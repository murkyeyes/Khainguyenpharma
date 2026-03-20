'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Collection } from 'lib/shopify/types';
import { sorting } from 'lib/constants';

export function SearchFilters({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const collection = searchParams.get('collection') || '';
  const sort = searchParams.get('sort') || '';
  const q = searchParams.get('q') || '';

  const handleCollectionChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('collection', value);
    } else {
      params.delete('collection');
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      {/* Collection Filter */}
      <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
        <label className="text-gray-700 font-semibold whitespace-nowrap">Danh mục:</label>
        <select
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:border-blue-500"
          value={collection}
          onChange={(e) => handleCollectionChange(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {collections.map((col) => (
            <option key={col.handle} value={col.handle}>
              {col.title}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
        <label className="text-gray-700 font-semibold whitespace-nowrap">Sắp xếp:</label>
        <select
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:border-blue-500"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          {sorting.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
