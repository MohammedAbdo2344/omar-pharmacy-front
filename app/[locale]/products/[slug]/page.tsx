import ProductDetailHero from '@/components/products/product-detail-hero';
import ProductNotesSection from '@/components/products/product-notes-section';
import ProductRelatedSection from '@/components/products/product-related-section';
import { ProductsServiceServer } from '@/services/products/products.service.server';
import { ConfigServiceServer } from '@/services/config/config.service.server';
import { getGuestTokenServer } from '@/lib/guest-session.server';
import type { ProductDetail } from '@/components/products/product-detail.types';
import type { ProductListItem } from '@/components/products/product-card';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const token = await getGuestTokenServer();

  if (!token || !slug) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const [detail, config] = await Promise.all([
    ProductsServiceServer.getProductBySlug(token, slug).catch(() => null),
    ConfigServiceServer.getConfig(token).catch(() => null),
  ]);

  const product = detail?.product as unknown as ProductDetail | undefined;

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const relatedProducts = (detail?.related_products ?? []) as unknown as ProductListItem[];

  return (
    <div className="min-h-screen">
      <ProductDetailHero product={product} />
      <ProductNotesSection product={product} config={config} />
      <ProductRelatedSection products={relatedProducts} />
    </div>
  );
}
