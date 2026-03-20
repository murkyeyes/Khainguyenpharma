import { Gallery } from "components/product/gallery";
import { ProductInfo } from "components/product/product-info";
import { ProductTabs } from "components/product/product-tabs";
import { RelatedProducts } from "components/product/related-products";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getProduct, getProductRecommendations } from "lib/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  // Get related products
  const relatedProducts = await getProductRecommendations(product.id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Trang chủ</a>
            <span className="mx-2">/</span>
            <a href="/search" className="hover:text-blue-600">Sản phẩm</a>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
            {/* Product Images - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Suspense
                fallback={
                  <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
                }
              >
                <Gallery
                  images={product.images.map((image) => ({
                    src: image.url,
                    altText: image.altText,
                  }))}
                />
              </Suspense>
            </div>

            {/* Product Info - Takes 3 columns */}
            <div className="lg:col-span-3">
              <ProductInfo product={product} />
            </div>
          </div>

          {/* Product Tabs - Description, Reviews, Related */}
          <ProductTabs 
            description={product.description} 
            descriptionHtml={product.descriptionHtml}
          />

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-8">
              <RelatedProducts products={relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
