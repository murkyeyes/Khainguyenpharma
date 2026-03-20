import { Product } from 'lib/shopify/types';
import Link from 'next/link';
import Image from 'next/image';

export function RelatedProducts({ products }: { products: Product[] }) {
  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(amount));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product) => (
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
                sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            <div className="p-3">
              <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="text-red-600 font-bold text-base">
                  {formatPrice(product.priceRange.maxVariantPrice.amount)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
