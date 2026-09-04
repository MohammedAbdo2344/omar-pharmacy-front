import { Stethoscope } from 'lucide-react';
import { resolveAssetUrl } from '@/lib/api/asset-url';
import { AddToCartButton } from '@/components/home/add-to-cart-button';
import WishlistButton from './wishlist-button';

const DEFAULT_PRODUCT_COLOR = '#e0f2fe';

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  final_price?: string | number;
  discount_percentage?: string | number;
  stock_quantity?: number;
  brand?: string | null;
  tablet_count?: string | null;
  is_best_seller?: boolean;
  is_popular?: boolean;
  is_featured?: boolean;
  requires_prescription?: boolean;
  primary_image?: { image?: string | null; image_url?: string | null; alt_text?: string | null } | null;
  active_discount?: { value?: string | number; type?: string } | null;
  categories?: { id: number; name: string }[];
  color?: string | null;
}

interface ProductCardProps {
  product: ProductListItem;
  labels: {
    currency: string;
    off: (percent: number | string) => string;
    bestSeller: string;
    popular: string;
    new: string;
    prescriptionNote: string;
  };
}

function getProductColor(color: string | null | undefined) {
  return color || DEFAULT_PRODUCT_COLOR;
}

export default function ProductCard({ product, labels }: ProductCardProps) {
  const price = Number(product.price);
  const finalPriceRaw = product.final_price ?? null;
  const finalPrice = finalPriceRaw !== null ? Number(finalPriceRaw) : null;
  const discountPercent = product.discount_percentage ?? product.active_discount?.value ?? null;
  const hasDiscount = finalPrice !== null && finalPrice < price;

  const imageUrl = resolveAssetUrl(product.primary_image?.image ?? product.primary_image?.image_url);
  const categoryName = product.categories?.[0]?.name;
  const productColor = getProductColor(product.color);

  const statusLabel = product.is_best_seller
    ? labels.bestSeller
    : product.is_popular
    ? labels.popular
    : product.is_featured
    ? labels.new
    : null;

  return (
    <a
      href={`/products/${product.slug}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col group"
    >
      <div
        className="relative m-2.5 border border-blue-100/60 rounded-2xl p-6 h-48 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: productColor }}
      >
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 flex-wrap">
          {hasDiscount && discountPercent && (
            <span className="bg-white/90 text-amber-700 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
              {labels.off(discountPercent)}
            </span>
          )}
          {statusLabel && (
            <span className="bg-white/90 text-blue-700 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
              {statusLabel}
            </span>
          )}
          {!hasDiscount && !statusLabel && categoryName && (
            <span className="bg-white/90 text-gray-500 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
              {categoryName}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-20">
          <WishlistButton productId={product.id} />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border-8 border-white/30" />
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-4 border-white/30" />
        </div>

        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product.primary_image?.alt_text || product.name}
            className="relative z-10 w-full h-full object-contain drop-shadow-lg"
          />
        ) : (
          <div className="relative z-10 w-full h-full bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="flex-1 flex items-center justify-center bg-blue-50/60">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div className="py-2 text-center">
              <div className="text-[10px] font-bold tracking-wide text-blue-600">OMAR</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {(product.brand || product.tablet_count) && (
          <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
            {[product.brand, product.tablet_count].filter(Boolean).join(' / ')}
          </div>
        )}
        <h3 className="mt-1 font-bold text-blue-950 line-clamp-2">{product.name}</h3>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-blue-950">
              {labels.currency} {hasDiscount ? finalPrice : price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {labels.currency} {price}
              </span>
            )}
          </div>

          <AddToCartButton productId={product.id} />
        </div>

        {product.requires_prescription && (
          <p className="mt-3 text-xs text-gray-400">{labels.prescriptionNote}</p>
        )}
      </div>
    </a>
  );
}
