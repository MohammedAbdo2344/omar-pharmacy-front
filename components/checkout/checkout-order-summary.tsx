'use client';

import { Minus, Plus, ShoppingBag, ShieldAlert } from 'lucide-react';
import { useCart } from '@/context/cart-context';

interface CheckoutOrderSummaryProps {
  labels: {
    badge: string;
    title: string;
    total: string;
    currency: string;
    prescriptionNote: string;
  };
}

export default function CheckoutOrderSummary({ labels }: CheckoutOrderSummaryProps) {
  const { items, total, updateQuantity, isMutating } = useCart();

  return (
    <div className="bg-blue-950 rounded-3xl p-6 sm:p-8 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-300">
            {labels.badge}
          </span>
        </div>
        <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ShoppingBag className="w-4 h-4 text-amber-300" />
        </span>
      </div>

      <h3 className="mt-3 text-2xl font-extrabold">{labels.title}</h3>

      <div className="mt-6 space-y-5 max-h-80 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-bold truncate">{item.product.name}</div>
              <div className="text-xs text-blue-200/70">
                {labels.currency} {item.unit_price}
              </div>
              <div className="mt-2 flex items-center gap-1 rounded-full border border-white/15 w-fit">
                <button
                  onClick={() => {
                    void updateQuantity(item.product_id, item.quantity - 1);
                  }}
                  disabled={isMutating || item.quantity <= 1}
                  className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white disabled:opacity-40 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                <button
                  onClick={() => {
                    void updateQuantity(item.product_id, item.quantity + 1);
                  }}
                  disabled={isMutating || item.quantity >= item.product.stock_quantity}
                  className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white disabled:opacity-40 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="font-bold text-amber-300 shrink-0">
              {labels.currency} {item.subtotal}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
        <span className="font-bold">{labels.total}</span>
        <span className="text-2xl font-extrabold text-amber-300">
          {labels.currency} {total}
        </span>
      </div>

      <div className="mt-4 bg-white/10 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-100/80">{labels.prescriptionNote}</p>
      </div>
    </div>
  );
}
