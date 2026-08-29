'use client';

import { Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
  productId: number;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isInCart, setIsInCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart || isAdding) return;

    setIsAdding(true);

    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        setIsInCart(true);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isInCart || isAdding}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
        isInCart 
          ? 'bg-green-100 text-green-600 cursor-default' 
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110'
      } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isAdding ? (
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      ) : isInCart ? (
        <ShoppingCart className="w-4 h-4" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
    </button>
  );
}