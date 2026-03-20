'use client';

import { ProductVariant } from 'lib/shopify/types';

export function AddToCart({
  variants,
  availableForSale,
  quantity = 1
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
  quantity?: number;
}) {
  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', { variants, quantity });
    alert('Đã thêm vào giỏ hàng!');
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!availableForSale}
      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-md transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span>THÊM VÀO GIỎ</span>
    </button>
  );
}
