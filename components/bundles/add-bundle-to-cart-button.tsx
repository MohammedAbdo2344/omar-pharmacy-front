'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Check, Ban } from 'lucide-react';
import { useCart } from '@/context/cart-context';

interface AddBundleToCartButtonProps {
  bundleId: number;
  isAvailable: boolean;
  maxQuantity: number | null;
  labels: {
    add: string;
    added: string;
    unavailable: string;
  };
  /**
   * `icon` renders a small circular button (product-card style, quantity 1);
   * `full` adds a quantity stepper and a wide pill (bundle detail page).
   */
  variant?: 'icon' | 'full';
}

export default function AddBundleToCartButton({
  bundleId,
  isAvailable,
  maxQuantity,
  labels,
  variant = 'icon',
}: AddBundleToCartButtonProps) {
  const { addBundle, isBundleInCart, error } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const inCart = isBundleInCart(bundleId);
  const cap = maxQuantity ?? Infinity;

  const handleAdd = async () => {
    if (inCart || isAdding || !isAvailable) return;
    setIsAdding(true);
    try {
      await addBundle(bundleId, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  const pillButton = (
    <button
      onClick={handleAdd}
      disabled={inCart || isAdding || !isAvailable}
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
      {!isAvailable ? labels.unavailable : inCart ? labels.added : labels.add}
    </button>
  );

  if (variant === 'icon') {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void handleAdd();
        }}
        disabled={inCart || isAdding || !isAvailable}
        aria-label={!isAvailable ? labels.unavailable : inCart ? labels.added : labels.add}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          !isAvailable
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : inCart
            ? 'bg-green-100 text-green-600 cursor-default'
            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110'
        } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isAdding ? (
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        ) : !isAvailable ? (
          <Ban className="w-4 h-4" />
        ) : inCart ? (
          <Check className="w-4 h-4" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </button>
    );
  }

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
            onClick={() => setQuantity((q) => Math.min(cap, q + 1))}
            disabled={inCart || quantity >= cap}
            className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-blue-600 disabled:opacity-40 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {pillButton}
      </div>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
    </div>
  );
}
