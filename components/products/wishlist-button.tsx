'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const STORAGE_KEY = 'omar-wishlist';

function readWishlist(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function writeWishlist(ids: number[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

interface WishlistButtonProps {
  productId: number;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading persisted state on mount
    setIsSaved(readWishlist().includes(productId));
  }, [productId]);

  const toggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const current = readWishlist();
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];

    writeWishlist(next);
    setIsSaved(next.includes(productId));
  };

  return (
    <button
      onClick={toggle}
      aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-pressed={isSaved}
      className="w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
    >
      <Heart className={`w-4 h-4 ${isSaved ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
    </button>
  );
}
