import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";
import { getProducts, getCollections } from "lib/api";
import { SearchFilters } from "./components/search-filters";

// Bắt buộc render động vì trang dùng no-store fetch (searchParams thay đổi theo request)
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Tất Cả Sản Phẩm - Khải Nguyên Pharma",
  description: "Tìm kiếm và mua sắm các sản phẩm dược phẩm chất lượng cao.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue, collection } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const collections = await getCollections();
  const resultsText = products.length > 1 ? "sản phẩm" : "sản phẩm";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
        {searchValue ? `Tìm kiếm: "${searchValue}"` : 'Tất Cả Sản Phẩm'}
      </h1>
      
      {/* Filters Bar */}
      <SearchFilters collections={collections} />
      
      {/* Results Count */}
      {searchValue ? (
        <p className="mb-6 text-gray-600">
          {products.length === 0
            ? "Không tìm thấy sản phẩm nào cho "
            : `Hiển thị ${products.length} ${resultsText} cho `}
          <span className="font-bold text-blue-600">&quot;{searchValue}&quot;</span>
        </p>
      ) : (
        <p className="mb-6 text-gray-600">
          Hiển thị {products.length} sản phẩm
        </p>
      )}
      
      {/* Product Grid */}
      {products.length > 0 ? (
        <Grid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <ProductGridItems products={products} />
        </Grid>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Không có sản phẩm nào được tìm thấy</p>
        </div>
      )}
    </div>
  );
}
