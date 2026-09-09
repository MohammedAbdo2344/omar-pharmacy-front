'use client';

import { useState } from 'react';
import { Minus, Plus, Trash2, Stethoscope, PackagePlus } from 'lucide-react';
import { resolveAssetUrl } from '@/lib/api/asset-url';
import type { CartItemRecord } from '@/services/cart/cart.interface';
import { useCart } from '@/context/cart-context';

const DEFAULT_PRODUCT_COLOR = '#e0f2fe';

interface CartItemRowProps {
  item: CartItemRecord;
  currency: string;
  labels: {
    bundleTag: string;
    contains: string;
    requestOnly: string;
  };
}

export default function CartItemRow({ item, currency, labels }: CartItemRowProps) {
  const { updateQuantity, removeItem, updateBundleQuantity, removeBundle, isMutating } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const isBundle = item.type === 'bundle';
  const bundle = item.bundle;
  const product = item.product;

  const isRequestOnly =
    !isBundle && (product?.is_request_only === true || product?.availability_type === 'request_only');

  const imageUrl = resolveAssetUrl(
    isBundle ? bundle?.image_url : product?.primary_image?.image_url
  );
  const cardColor = isBundle ? '#f3e8ff' : product?.color || DEFAULT_PRODUCT_COLOR;
  const name = isBundle ? bundle?.name ?? '' : product?.name ?? '';

  /** Upper bound on the + stepper. Request-only products and unconstrained bundles have none. */
  const maxQuantity = isBundle
    ? bundle?.max_available_quantity ?? Infinity
    : isRequestOnly
      ? Infinity
      : product?.stock_quantity ?? Infinity;

  const runChange = async (fn: () => Promise<void>) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await fn();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuantityChange = (nextQuantity: number) => {
    if (nextQuantity < 1) return;
    return runChange(() =>
      isBundle && item.bundle_id != null
        ? updateBundleQuantity(item.bundle_id, nextQuantity)
        : item.product_id != null
          ? updateQuantity(item.product_id, nextQuantity)
          : Promise.resolve()
    );
  };

  const handleRemove = () =>
    runChange(() =>
      isBundle && item.bundle_id != null
        ? removeBundle(item.bundle_id)
        : item.product_id != null
          ? removeItem(item.product_id)
          : Promise.resolve()
    );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex items-start gap-5">
      <div
        className="relative w-20 h-24 shrink-0 rounded-xl flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: cardColor }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="w-14 h-20 object-contain drop-shadow" />
        ) : isBundle ? (
          <PackagePlus className="w-6 h-6 text-purple-500" />
        ) : (
          <div className="w-14 h-20 bg-white rounded-lg shadow flex flex-col overflow-hidden">
            <div className="flex-1 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            <div className="py-1.5 text-center">
              <div className="text-[9px] font-bold tracking-wide text-blue-600">OMAR</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {isBundle && (
                <span className="text-[10px] font-bold tracking-wide uppercase text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                  {labels.bundleTag}
                </span>
              )}
              <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">OMAR</div>
            </div>
            <h3 className="font-bold text-blue-950 truncate">{name}</h3>
            {isBundle && bundle && (
              <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                <span className="font-semibold">{labels.contains} </span>
                {bundle.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
              </p>
            )}
            {isRequestOnly && (
              <p className="mt-1 text-xs font-semibold text-amber-700">{labels.requestOnly}</p>
            )}
          </div>
          <button
            onClick={handleRemove}
            disabled={isMutating || isUpdating}
            aria-label="Remove item"
            className="text-gray-300 hover:text-red-500 transition-colors shrink-0 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1 rounded-full border border-gray-200">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || isMutating || item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-blue-950">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || isMutating || item.quantity >= maxQuantity}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-400">{currency}</span>
            <span className="text-lg font-extrabold text-blue-950">{item.subtotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
