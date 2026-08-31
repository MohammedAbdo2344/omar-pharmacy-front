import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ProductDetailHero from '@/components/products/product-detail-hero';
import ProductNotesSection from '@/components/products/product-notes-section';
import ProductRelatedSection from '@/components/products/product-related-section';
import { ProductsService } from '@/services/products/products.service';
import { ConfigService } from '@/services/config/config.service';
import { GUEST_SESSION_COOKIE } from '@/lib/guest-session';
import type { ProductDetail } from '@/components/products/product-detail.types';
import type { ProductListItem } from '@/components/products/product-card';
import type { ConfigData } from '@/services/config/config.interface';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_SESSION_COOKIE)?.value;

  if (!token) {
    notFound();
  }

  let product: ProductDetail | null = null;
  let relatedProducts: ProductListItem[] = [];
  let config: ConfigData | null = null;

  try {
    const [detail, configData] = await Promise.all([
      ProductsService.getProductBySlug(token, slug),
      ConfigService.getConfig(token).catch(() => null),
    ]);
    product = detail.product as unknown as ProductDetail;
    relatedProducts = detail.related_products as unknown as ProductListItem[];
    config = configData;
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <ProductDetailHero product={product} />
      <ProductNotesSection product={product} config={config} />
      <ProductRelatedSection products={relatedProducts} />
    </div>
  );
}
