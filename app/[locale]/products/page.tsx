import { cookies } from 'next/headers';
import ProductsHeroSection from '@/components/products/products-hero-section';
import ProductsShelfSection from '@/components/products/products-shelf-section';
import { ProductsService } from '@/services/products/products.service';
import { CategoriesService } from '@/services/categories/categories.service';
import type { ProductListData } from '@/services/products/products.interface';
import type { CategoryRecord } from '@/services/categories/categories.interface';
import { GUEST_SESSION_COOKIE } from '@/lib/guest-session';

interface ProductsSearchParams {
  search?: string;
  page?: string;
  category_id?: string;
  max_price?: string;
  sort_by_price?: string;
}

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    search?: string;
    category_id?: string;
    max_price?: string;
    page?: string;
    sort_by_price?: string;
  }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const { search, category_id: categoryId, max_price: maxPrice, page, sort_by_price: sortByPrice } =
    await searchParams;

  const token = await getGuestTokenServer();

  const [data, categories] = await Promise.all([
    token
      ? ProductsServiceServer.getProducts(token, {
          search: search || undefined,
          page: page ? Number(page) : undefined,
          category_id: categoryId ? Number(categoryId) : undefined,
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
        search={params.search}
        categoryId={params.category_id}
        maxPrice={params.max_price}
      />
    </div>
  );
}
