import { Product } from "lib/shopify/types";
import Link from "next/link";
import Image from "next/image";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(amount));
  };

  return (
    <>
      {products.map((product) => (
        <Link
          key={product.handle}
          href={`/product/${product.handle}`}
          className="group bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.featuredImage?.url || '/placeholder.jpg'}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-gray-800 text-sm md:text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-red-600 font-bold text-lg">
                {formatPrice(product.priceRange.maxVariantPrice.amount)}
              </span>
              
              {product.availableForSale ? (
                <span className="text-xs text-green-600 font-semibold">
                  Còn hàng
                </span>
              ) : (
                <span className="text-xs text-gray-400 font-semibold">
                  Hết hàng
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
