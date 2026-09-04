import { getTranslations } from 'next-intl/server';
import { Stethoscope } from 'lucide-react';
import type { HomeProduct } from '@/services/home/home.interface';
import { resolveAssetUrl } from '@/lib/api/asset-url';
import { AddToCartButton } from './add-to-cart-button';

const DEFAULT_PRODUCT_COLOR = '#e0f2fe';

interface ProductsSectionProps {
  products: HomeProduct[];
}

function getProductColor(color: string | null | undefined) {
  return color || DEFAULT_PRODUCT_COLOR;
}

export default async function ProductsSection({ products }: ProductsSectionProps) {
  const t = await getTranslations('productsSection');

  if (products.length === 0) {
    return null;
  }

  const flagLabel = (flag: HomeProduct['flag']) => {
    if (flag === 'popular') return t('popular');
    if (flag === 'best_seller') return t('bestSeller');
    return t('highOffer');
  };

  const calculateDiscountedPrice = (originalPrice: number, discountValue: string, discountType: string) => {
    const discountAmount = parseFloat(discountValue);
    if (discountType === 'percentage') {
      return (originalPrice * (1 - discountAmount / 100)).toFixed(2);
    }
    return (originalPrice - discountAmount).toFixed(2);
  };

  return (
    <section className="py-16 bg-blue-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            {t('badge')}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950">{t('title')}</h2>
        <p className="mt-2 text-gray-500 max-w-xl">{t('subtitle')}</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const productColor = getProductColor(product.color);
            const price = Number(product.price);
            const hasDiscount = product.active_discount !== null;
            const discountedPrice = hasDiscount && product.active_discount
              ? calculateDiscountedPrice(price, product.active_discount.value, product.active_discount.type)
              : null;

            return (
              <a
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                <div
                  className="relative m-2.5 border border-blue-100 rounded-2xl p-6 h-48 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: productColor }}
                >
                  {hasDiscount && product.active_discount && (
                    <span className="absolute top-3 left-3 z-20 bg-amber-100 text-amber-700 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full">
                      {t('off', { percent: product.active_discount.value })}
                    </span>
                  )}

                  {!hasDiscount && (
                    <span className="absolute top-3 left-3 z-20 bg-amber-100 text-amber-700 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full">
                      {flagLabel(product.flag)}
                    </span>
                  )}

                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border-8 border-white/30" />
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-4 border-white/30" />
                  </div>

                  {product.primary_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveAssetUrl(product.primary_image.image_url) ?? undefined}
                      alt={product.primary_image.alt_text || product.name}
                      className="relative z-10 w-full h-full object-contain drop-shadow-lg"
                    />
                  ) : (
                    <div className="relative z-10 w-full h-full bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
                      <div className="flex-1 flex items-center justify-center bg-blue-50/60">
                        <Stethoscope className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="py-2 text-center">
                        <div className="text-[10px] font-bold tracking-wide text-blue-600">OMAR</div>
                        <div className="text-[9px] text-gray-500">capsule</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-blue-950 line-clamp-2 text-sm">{product.name}</h3>

                  {product.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.description}</p>
                  )}

                  {product.tablet_count && (
                    <p className="text-xs text-gray-400 mt-1 font-medium">{product.tablet_count}</p>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-blue-700">
                          {t('currency')} {discountedPrice || price}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-400 line-through">
                            {t('currency')} {price}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <AddToCartButton productId={product.id} />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
