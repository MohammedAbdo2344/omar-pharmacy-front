'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/cart-context';

interface ProductDetailActionsProps {
  productId: number;
  stockQuantity: number;
  isRequestOnly?: boolean;
  addLabel: string;
  addedLabel: string;
}

export default function ProductDetailActions({ productId, stockQuantity, isRequestOnly = false, addLabel, addedLabel }: ProductDetailActionsProps) {
  const { addItem, isInCart, error } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const inCart = isInCart(productId);
  const outOfStock = !isRequestOnly && stockQuantity <= 0;
  /** Request-only products bypass inventory; other products cap at stock. */
  const maxQuantity = isRequestOnly ? Infinity : stockQuantity;

  const handleAdd = async () => {
    if (inCart || isAdding || outOfStock) return;
    setIsAdding(true);
    try {
      await addItem(productId, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1 rounded-full border border-gray-200">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={inCart || quantity <= 1}
            className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-blue-600 disabled:opacity-40 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-bold text-blue-950">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            disabled={inCart || quantity >= maxQuantity}
            className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-blue-600 disabled:opacity-40 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={inCart || isAdding || outOfStock}
          className={`flex-1 min-w-45 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold transition-colors ${
            inCart
              ? 'bg-emerald-100 text-emerald-700 cursor-default'
              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60'
          }`}
        >
          {isAdding ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : inCart ? (
            <Check className="w-4 h-4" />
          ) : (
            <ShoppingBag className="w-4 h-4" />
          )}
          {inCart ? addedLabel : addLabel}
        </button>
      </div>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
    </div>
  );
}
