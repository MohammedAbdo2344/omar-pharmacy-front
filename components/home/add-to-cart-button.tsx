'use client';

import { Plus, Check, Ban } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/cart-context';

interface AddToCartButtonProps {
  productId: number;
  outOfStock?: boolean;
}

export function AddToCartButton({ productId, outOfStock = false }: AddToCartButtonProps) {
  const { addItem, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const inCart = isInCart(productId);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCart || isAdding || outOfStock) return;

    setIsAdding(true);
    try {
      await addItem(productId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={inCart || isAdding || outOfStock}
      aria-label={outOfStock ? 'Out of stock' : inCart ? 'Added to cart' : 'Add to cart'}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
        outOfStock
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : inCart
          ? 'bg-green-100 text-green-600 cursor-default'
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110'
      } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isAdding ? (
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      ) : outOfStock ? (
        <Ban className="w-4 h-4" />
      ) : inCart ? (
        <Check className="w-4 h-4" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
    </button>
  );
}
