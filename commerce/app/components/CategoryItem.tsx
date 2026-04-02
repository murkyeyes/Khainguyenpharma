'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface CategoryItemProps {
  href: string;
  icon: ReactNode;
  label: string;
}

export function CategoryItem({ href, icon, label }: CategoryItemProps) {
  return (
    <Link 
      href={href}
      className="relative flex flex-col items-center gap-3 p-4 hover:-translate-y-1 transition-all duration-300 group rounded-xl overflow-visible"
    >
      <div className="w-16 h-16 flex items-center justify-center text-[#1a3a7a] group-hover:text-blue-600 transition-colors duration-300 bg-white shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-blue-200 rounded-full">
        {icon}
      </div>
      <span className="text-sm font-bold text-center text-gray-800 group-hover:text-[#1a3a7a] transition-colors relative z-10">
        {label}
      </span>
    </Link>
  );
}
