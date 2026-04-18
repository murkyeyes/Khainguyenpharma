'use client';

import { Product } from 'lib/shopify/types';
import { useState } from 'react';
import { AddToCart } from './add-to-cart';

import { useCart } from 'components/cart/cart-context';
import { addItem } from 'components/cart/actions';
import { useActionState, startTransition, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addCartItem } = useCart();
  const [message, formAction] = useActionState(addItem, null);
  const [isPending, startTransitionHook] = useTransition();

  const defaultVariant = product.variants?.[0];

  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(amount));
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      router.push("/auth/login");
      return;
    }

    if (!defaultVariant) return;
    addCartItem(defaultVariant, product, quantity);
    startTransitionHook(() => {
      formAction({ selectedVariantId: defaultVariant.id, quantity });
    });
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để mua hàng");
      router.push("/auth/login");
      return;
    }

    if (!defaultVariant) return;
    // Đi thẳng đến quy trình thanh toán riêng cho sản phẩm này, không dính líu giỏ hàng chung
    const directItem = {
      id: "direct-" + defaultVariant.id,
      quantity: quantity,
      cost: {
        totalAmount: {
          amount: (parseFloat(defaultVariant.price.amount) * quantity).toString(),
          currencyCode: defaultVariant.price.currencyCode
        }
      },
      merchandise: {
        id: defaultVariant.id,
        title: defaultVariant.title,
        product: {
          id: product.id,
          title: product.title,
          featuredImage: product.featuredImage
        }
      }
    };
    localStorage.setItem('direct_buy_item', JSON.stringify(directItem));
    router.push(`/checkout?buyNow=1`);
  };

  return (
    <div className="space-y-4">
      {/* Product Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.title}</h1>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-4xl md:text-5xl font-bold text-red-600">
          {formatPrice(product.priceRange.maxVariantPrice.amount)}
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-semibold text-sm">Số lượng</label>
        <div className="flex items-center">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center border-2 border-gray-300 py-2 px-3 rounded focus:outline-none focus:border-blue-500"
            min="1"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={handleAddToCart} 
          disabled={isPending}
          className={`flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded transition-colors duration-300 flex items-center justify-center gap-2 ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
          <span>{isPending ? "ĐANG THÊM..." : "THÊM VÀO GIỎ"}</span>
        </button>
        <button onClick={handleBuyNow} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition-colors duration-300 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>MUA NGAY</span>
        </button>
      </div>

      {/* Facebook Like Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <div className="fb-like" data-share="true" data-width="450" data-show-faces="true"></div>
      </div>
    </div>
  );
}
