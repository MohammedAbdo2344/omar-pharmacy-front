import ProductsHeroSection from '@/components/products/products-hero-section';
import ProductsShelfSection from '@/components/products/products-shelf-section';
import { ProductsServiceServer } from '@/services/products/products.service.server';
import { CategoriesServiceServer } from '@/services/categories/categories.service.server';
import type { CategoryRecord } from '@/services/categories/categories.interface';
import { getGuestTokenServer } from '@/lib/guest-session.server';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    search?: string;
    category_id?: string;
    subcategory_id?: string;
    availability_type?: string;
    max_price?: string;
    page?: string;
    sort_by_price?: string;
  }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const {
    search,
    category_id: categoryId,
    subcategory_id: subcategoryId,
    availability_type: availabilityType,
    max_price: maxPrice,
    page,
    sort_by_price: sortByPrice,
  } = await searchParams;

  const requestOnly = availabilityType === 'request_only';

  const token = await getGuestTokenServer();

  const [data, categories] = await Promise.all([
    token
      ? ProductsServiceServer.getProducts(token, {
          search: search || undefined,
          page: page ? Number(page) : undefined,
          category_id: categoryId ? Number(categoryId) : undefined,
          subcategory_id: subcategoryId ? Number(subcategoryId) : undefined,
          availability_type: requestOnly ? 'request_only' : undefined,
          min_price: maxPrice ? 0 : undefined,
          max_price: maxPrice ? Number(maxPrice) : undefined,
          sort_by_price:
            sortByPrice === 'low_to_high' || sortByPrice === 'high_to_low' ? sortByPrice : undefined,
        }, locale).catch(() => null)
      : null,
    token
      ? CategoriesServiceServer.getCategories(token, locale).catch(() => [] as CategoryRecord[])
      : ([] as CategoryRecord[]),
  ]);

  return (
    <div className="min-h-screen">
      <ProductsHeroSection />
      <ProductsShelfSection
        data={data}
        categories={categories}
        search={search}
        categoryId={categoryId}
        subcategoryId={subcategoryId}
        requestOnly={requestOnly}
        maxPrice={maxPrice}
      />
    </div>
  );
}
