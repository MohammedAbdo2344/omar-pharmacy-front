'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Clock, Wallet, MessageCircle, ArrowRight, PackageCheck, ShieldCheck, Copy, ShoppingBag } from 'lucide-react';
import type { CheckoutData } from '@/services/checkout/checkout.interface';

interface CheckoutSuccessProps {
  order: CheckoutData['order'];
  siteName: string;
  whatsappNumber: string;
  paymentMethod: 'cod' | 'instapay';
}

export default function CheckoutSuccess({ order, siteName, whatsappNumber, paymentMethod }: CheckoutSuccessProps) {
  const t = useTranslations('checkoutPage');
  const [copied, setCopied] = useState(false);

  const whatsappMessage = t('whatsappMessage', { siteName, orderNumber: order.order_number, total: order.total });
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(order.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable, ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center mx-auto">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
            <Check className="w-7 h-7 text-white" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
            {t('successBadge')}
          </span>
        </div>

        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-blue-950 leading-tight">
          {t('successTitle')}
        </h1>
        <p className="mt-4 text-gray-500 max-w-lg mx-auto">
          {t('successDescription', { siteName })}
        </p>
      </div>

      {/* Order info card */}
      <div className="mt-10 bg-blue-50/60 border border-blue-100 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">
              {t('orderNumber')}
            </div>
            <div className="mt-1 text-2xl font-extrabold text-blue-950">#{order.order_number}</div>
          </div>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-4 py-2 rounded-full">
            {t('awaitingConfirmation')}
          </span>
        </div>

        <div className="mt-6 pt-6 border-t border-blue-100 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2 text-blue-950">
            <Clock className="w-4 h-4 text-blue-600" />
            {t('deliveryFollowUp')}
          </div>
          <div className="flex items-center gap-2 text-blue-950">
            <Wallet className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">{paymentMethod === 'cod' ? t('cod') : t('instapay')}</span>
          </div>
        </div>
      </div>

      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-4 bg-blue-600 text-white rounded-2xl px-6 py-5 hover:bg-blue-700 transition-colors"
        >
          <span className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <div className="font-bold">{t('confirmOnWhatsapp')}</div>
            <div className="text-sm text-blue-100">{t('confirmOnWhatsappSubtitle')}</div>
          </div>
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </a>
      )}

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Quick look at items */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-emerald-600">
                {t('quickLookBadge')}
              </div>
              <h2 className="mt-1 text-xl font-bold text-blue-950">{t('yourOrder')}</h2>
            </div>
            <span className="text-sm text-gray-400">
              {t('orderItemsCount', { count: order.items.length })}
            </span>
          </div>

          <div className="mt-4 divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-blue-950">{item.product_name}</div>
                  <div className="text-sm text-gray-400">
                    {t('qtyLabel', { quantity: item.quantity })} · {t('currency')} {item.unit_price}
                  </div>
                </div>
                <div className="font-bold text-blue-950 shrink-0">
                  {t('currency')} {item.subtotal}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="font-bold text-blue-950">{t('total')}</span>
            <span className="text-xl font-extrabold text-blue-950">
              {t('currency')} {order.total}
            </span>
          </div>
        </div>

        {/* What happens next */}
        <div className="space-y-4">
          <div className="bg-amber-50 rounded-3xl p-6">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
              <PackageCheck className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="mt-4 font-bold text-blue-950">{t('nextTitle')}</h3>
            <p className="mt-2 text-sm text-amber-900/80">{t('nextDescription')}</p>

            <div className="mt-4 pt-4 border-t border-amber-200/70 flex items-start gap-2 text-xs text-amber-900/80">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{t('nextPrescriptionNote')}</p>
            </div>
          </div>

          <a
            href="/products"
            className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-full px-6 py-4 font-semibold text-blue-950 hover:border-blue-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              {t('continueShopping')}
            </span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </a>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="mt-10 mx-auto flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors"
      >
        <Copy className="w-3.5 h-3.5" />
        {copied ? t('orderNumberCopied') : t('keepOrderHandy', { orderNumber: order.order_number })}
      </button>
    </div>
  );
}
