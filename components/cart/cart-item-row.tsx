'use client';

import { useState } from 'react';
import { Minus, Plus, Trash2, Stethoscope } from 'lucide-react';
import { resolveAssetUrl } from '@/lib/api/asset-url';
import type { CartItemRecord } from '@/services/cart/cart.interface';
import { useCart } from '@/context/cart-context';

interface CartItemRowProps {
  item: CartItemRecord;
  currency: string;
  cardBg: string;
  iconColor: string;
}

export default function CartItemRow({ item, currency, cardBg, iconColor }: CartItemRowProps) {
  const { updateQuantity, removeItem, isMutating } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const imageUrl = resolveAssetUrl(item.product.primary_image?.image_path);

  const handleQuantityChange = async (nextQuantity: number) => {
    if (nextQuantity < 1 || isUpdating) return;
    setIsUpdating(true);
    try {
      await updateQuantity(item.product_id, nextQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await removeItem(item.product_id);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex items-center gap-5">
      <div className={`relative w-20 h-24 shrink-0 rounded-xl ${cardBg} flex items-center justify-center overflow-hidden`}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={item.product.name} className="w-14 h-20 object-contain drop-shadow" />
        ) : (
          <div className="w-14 h-20 bg-white rounded-lg shadow flex flex-col overflow-hidden">
            <div className="flex-1 flex items-center justify-center">
              <Stethoscope className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="py-1.5 text-center">
              <div className={`text-[9px] font-bold tracking-wide ${iconColor}`}>OMAR</div>
              <div className="text-[8px] text-gray-400">{item.product.stock_availability}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">OMAR</div>
            <h3 className="font-bold text-blue-950 truncate">{item.product.name}</h3>
          </div>
          <button
            onClick={handleRemove}
            disabled={isMutating}
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
              disabled={isUpdating || isMutating}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-blue-950">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || isMutating || item.quantity >= item.product.stock_quantity}
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
