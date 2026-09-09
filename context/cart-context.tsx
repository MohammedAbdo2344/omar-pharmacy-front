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
import { BackendApiError } from '@/lib/api/errors';
import { getGuestTokenClient } from '@/lib/guest-session';

interface CartContextValue {
  items: CartItemRecord[];
  itemCount: number;
  total: number;
  isLoading: boolean;
  isMutating: boolean;
  /** Last user-facing error message from a failed mutation (business 422s), or null. */
  error: string | null;
  clearError: () => void;
  refresh: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  addBundle: (bundleId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateBundleQuantity: (bundleId: number, quantity: number) => Promise<void>;
  removeBundle: (bundleId: number) => Promise<void>;
  isInCart: (productId: number) => boolean;
  isBundleInCart: (bundleId: number) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

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

  /** Runs a cart mutation, surfacing backend messages and always re-syncing afterwards. */
  const runMutation = useCallback(
    async (mutate: () => Promise<unknown>) => {
      const token = getGuestTokenClient();
      if (!token) return;

      setIsMutating(true);
      setError(null);
      try {
        await mutate();
      } catch (err) {
        if (err instanceof BackendApiError) {
          setError(err.message);
        } else {
          throw err;
        }
      } finally {
        await refresh();
        setIsMutating(false);
      }
    },
    [refresh]
  );

  const addItem = useCallback(
    (productId: number, quantity = 1) =>
      runMutation(() => {
        const token = getGuestTokenClient()!;
        return CartService.addItem(token, { product_id: productId, quantity });
      }),
    [runMutation]
  );

  const addBundle = useCallback(
    (bundleId: number, quantity = 1) =>
      runMutation(() => {
        const token = getGuestTokenClient()!;
        return CartService.addItem(token, { type: 'bundle', bundle_id: bundleId, quantity });
      }),
    [runMutation]
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number) =>
      runMutation(() => {
        const token = getGuestTokenClient()!;
        return CartService.updateItemQuantity(token, productId, { quantity });
      }),
    [runMutation]
  );

  const removeItem = useCallback(
    (productId: number) =>
      runMutation(() => {
        const token = getGuestTokenClient()!;
        return CartService.removeItem(token, productId);
      }),
    [runMutation]
  );

  const updateBundleQuantity = useCallback(
    (bundleId: number, quantity: number) =>
      runMutation(() => {
        const token = getGuestTokenClient()!;
        return CartService.updateBundleQuantity(token, bundleId, { quantity });
      }),
    [runMutation]
  );

  const removeBundle = useCallback(
    (bundleId: number) =>
      runMutation(() => {
        const token = getGuestTokenClient()!;
        return CartService.removeBundle(token, bundleId);
      }),
    [runMutation]
  );

  const isInCart = useCallback(
    (productId: number) => items.some((item) => item.type === 'product' && item.product_id === productId),
    [items]
  );

  const isBundleInCart = useCallback(
    (bundleId: number) => items.some((item) => item.type === 'bundle' && item.bundle_id === bundleId),
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
      error,
      clearError,
      refresh,
      addItem,
      addBundle,
      updateQuantity,
      removeItem,
      updateBundleQuantity,
      removeBundle,
      isInCart,
      isBundleInCart,
    }),
    [
      items,
      itemCount,
      total,
      isLoading,
      isMutating,
      error,
      clearError,
      refresh,
      addItem,
      addBundle,
      updateQuantity,
      removeItem,
      updateBundleQuantity,
      removeBundle,
      isInCart,
      isBundleInCart,
    ]
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
