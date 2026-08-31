import { getTranslations } from 'next-intl/server';
import { ChevronRight, Check } from 'lucide-react';
import { resolveAssetUrl } from '@/lib/api/asset-url';
import { stripHtml } from '@/lib/strip-html';
import ProductDetailActions from './product-detail-actions';
import ProductImageGallery from './product-image-gallery';
import type { ProductDetail } from './product-detail.types';

const DEFAULT_PRODUCT_COLOR = '#d0f0ff';

interface ProductDetailHeroProps {
  product: ProductDetail;
}

function getProductColor(color: string | null | undefined) {
  return color || DEFAULT_PRODUCT_COLOR;
}

export default async function ProductDetailHero({ product }: ProductDetailHeroProps) {
  const t = await getTranslations('productDetailPage');

  const price = Number(product.price);
  const finalPrice = product.final_price !== undefined ? Number(product.final_price) : null;
  const hasDiscount = finalPrice !== null && finalPrice < price;
  const discountPercent = product.discount_percentage ?? product.active_discount?.value ?? null;
  const savings = hasDiscount && finalPrice !== null ? (price - finalPrice).toFixed(2) : null;

  const inStock = (product.stock_quantity ?? 0) > 0;
  const productColor = getProductColor(product.color);

  const galleryImages = (
    product.images && product.images.length > 0
      ? product.images
      : product.primary_image
        ? [product.primary_image]
        : []
  )
    .map((img) => ({
      url: resolveAssetUrl(img.image ?? img.image_path),
      alt: img.alt_text || product.name,
    }))
    .filter((img): img is { url: string; alt: string } => Boolean(img.url));

  return (
    <section className="bg-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <a href="/products" className="hover:text-blue-600 transition-colors">{t('breadcrumbProducts')}</a>
          {product.category_name && (
            <>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              <span className="font-semibold text-blue-950">{product.category_name}</span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          <span className="font-semibold text-blue-950">{product.name}</span>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Image */}
          <ProductImageGallery
            images={galleryImages}
            productColor={productColor}
            fallbackLabel={product.tablet_count}
          />

          {/* Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {hasDiscount && discountPercent && (
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
                  {t('off', { percent: discountPercent })}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
              >
                {inStock && <Check className="w-3 h-3" />}
                {inStock ? t('inStock') : t('outOfStock')}
              </span>
            </div>

            <div className="mt-4 text-xs font-semibold tracking-widest uppercase text-emerald-700">
              {[product.brand, product.category_name].filter(Boolean).join(' · ')}
            </div>

            <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-blue-950 leading-tight">
              {product.name}
            </h1>

            {(product.short_description || product.description) && (
              <p className="mt-5 text-lg text-gray-500 max-w-xl break-words">
                {stripHtml(product.short_description || product.description)}
              </p>
            )}

            <div className="mt-6 flex items-baseline gap-3 pb-6 border-b border-gray-100">
              <span className="text-3xl font-extrabold text-blue-950">
                {t('currency')} {hasDiscount ? finalPrice : price}
              </span>
              {hasDiscount && savings && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {t('currency')} {price}
                  </span>
                  <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    {t('save', { amount: savings })}
                  </span>
                </>
              )}
            </div>

            <div className="mt-6">
              <ProductDetailActions
                productId={product.id}
                stockQuantity={product.stock_quantity ?? 0}
                addLabel={t('addToCart')}
                addedLabel={t('addedToCart')}
              />
            </div>

            <p className="mt-4 text-sm text-gray-400">{t('deliveryEstimate')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
