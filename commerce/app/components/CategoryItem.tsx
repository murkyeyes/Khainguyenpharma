'use client';

import Link from 'next/link';

interface CategoryItemProps {
  href: string;
  icon: string;
  label: string;
}

export function CategoryItem({ href, icon, label }: CategoryItemProps) {
  return (
    <Link 
      href={href}
      className="relative flex flex-col items-center gap-3 p-4 hover:scale-110 transition-all duration-300 group rounded-xl overflow-visible"
      style={{ perspective: '1000px' }}
    >
      <div className="text-5xl md:text-6xl group-hover:scale-125 transition-transform duration-300 drop-shadow-lg relative z-10">
        {icon}
      </div>
      <span className="text-sm font-bold text-center text-gray-800 group-hover:text-blue-600 transition-colors relative z-10">
        {label}
      </span>
    </Link>
  );
}
