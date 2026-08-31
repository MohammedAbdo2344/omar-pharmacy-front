'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CartService } from '@/services/cart/cart.service';
import type { CartItemRecord } from '@/services/cart/cart.interface';
import { getGuestTokenClient } from '@/lib/guest-session';

interface CartContextValue {
  items: CartItemRecord[];
  itemCount: number;
  total: number;
  isLoading: boolean;
  isMutating: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const refresh = useCallback(async () => {
    const token = getGuestTokenClient();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await CartService.getCart(token);
      setItems(data.cart.items);
      setTotal(data.cart.total);
    } catch {
      // Cart unavailable — leave previous state in place.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial cart fetch on mount
    void refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (productId: number, quantity = 1) => {
      const token = getGuestTokenClient();
      if (!token) return;

      setIsMutating(true);
      try {
        await CartService.addItem(token, { product_id: productId, quantity });
        await refresh();
      } finally {
        setIsMutating(false);
      }
    },
    [refresh]
  );

  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      const token = getGuestTokenClient();
      if (!token) return;

      setIsMutating(true);
      try {
        await CartService.updateItemQuantity(token, productId, { quantity });
        await refresh();
      } finally {
        setIsMutating(false);
      }
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (productId: number) => {
      const token = getGuestTokenClient();
      if (!token) return;

      setIsMutating(true);
      try {
        await CartService.removeItem(token, productId);
        await refresh();
      } finally {
        setIsMutating(false);
      }
    },
    [refresh]
  );

  const isInCart = useCallback(
    (productId: number) => items.some((item) => item.product_id === productId),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      total,
      isLoading,
      isMutating,
      refresh,
      addItem,
      updateQuantity,
      removeItem,
      isInCart,
    }),
    [items, itemCount, total, isLoading, isMutating, refresh, addItem, updateQuantity, removeItem, isInCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
