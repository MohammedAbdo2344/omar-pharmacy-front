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
  searchParams: Promise<ProductsSearchParams>;
}

async function getProductsData(
  token: string | undefined,
  params: ProductsSearchParams
): Promise<ProductListData | null> {
  if (!token) return null;

  try {
    return await ProductsService.getProducts(token, {
      search: params.search || undefined,
      page: params.page ? Number(params.page) : undefined,
      category_id: params.category_id ? Number(params.category_id) : undefined,
      max_price: params.max_price ? Number(params.max_price) : undefined,
      sort_by_price:
        params.sort_by_price === 'low_to_high' || params.sort_by_price === 'high_to_low'
          ? params.sort_by_price
          : undefined,
    });
  } catch {
    return null;
  }
}

async function getCategoriesData(token: string | undefined): Promise<CategoryRecord[]> {
  if (!token) return [];

  try {
    return await CategoriesService.getCategories(token);
  } catch {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_SESSION_COOKIE)?.value;

  const [data, categories] = await Promise.all([
    getProductsData(token, params),
    getCategoriesData(token),
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
