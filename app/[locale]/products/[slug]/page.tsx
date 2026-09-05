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
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug, locale } = await params;
  const token = await getGuestTokenServer();

  if (!token || !slug) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const [detail, config] = await Promise.all([
    ProductsServiceServer.getProductBySlug(token, slug, locale).catch(() => null),
    ConfigServiceServer.getConfig(token, locale).catch(() => null),
  ]);

  const product = detail?.product as unknown as ProductDetail | undefined;

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
