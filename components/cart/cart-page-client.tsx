'use client';

import { useTranslations } from 'next-intl';
import { ChevronRight, ShieldCheck, ShoppingBag, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import CartItemRow from './cart-item-row';
import BrandLoader from '@/components/shared/brand-loader';

export default function CartPageClient() {
  const t = useTranslations('cartPage');
  const { items, itemCount, total, isLoading } = useCart();

  return (
    <div className="bg-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gray-400">
          <a href="/" className="hover:text-blue-600 transition-colors">{t('breadcrumbHome')}</a>
          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          <span className="text-blue-900">{t('breadcrumbCart')}</span>
        </div>

        <div className="mt-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
                {t('badge')}
              </span>
            </div>
            <h1 className="mt-4 text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              <span className="block text-blue-950">{t('titleLine1')}</span>
              <span className="block text-blue-600">{t('titleLine2')}</span>
            </h1>
          </div>
          <p className="max-w-sm text-gray-500">
            {t('subtitlePrefix')} <span className="text-gray-400">{t('subtitleSuffix')}</span>
          </p>
        </div>

        {isLoading ? (
          <BrandLoader fullScreen={false} />
        ) : items.length === 0 ? (
          <div className="mt-14 bg-white rounded-3xl border border-gray-100 p-16 text-center">
            <ShoppingBag className="w-10 h-10 text-blue-300 mx-auto" />
            <h2 className="mt-4 text-xl font-bold text-blue-950">{t('emptyTitle')}</h2>
            <p className="mt-2 text-gray-500">{t('emptyDescription')}</p>
            <a
              href="/"
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('continueShopping')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: basket */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-blue-950">
                  {t('yourBasket')} <span className="text-gray-400 font-medium">({t('itemsCount', { count: itemCount })})</span>
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  {t('secureSelection')}
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} currency={t('currency')} />
                ))}
              </div>

              <a
                href="/"
                className="mt-6 inline-flex items-center gap-2 text-blue-950 font-semibold hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                {t('continueShopping')}
              </a>
            </div>

            {/* Right: order overview */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
                  {t('orderOverview')}
                </span>
                <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-extrabold text-blue-950">{t('simpleFinish')}</h3>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{t('subtotal')}</span>
                  <span className="font-semibold text-blue-950">{t('currency')} {total}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-100 flex items-center justify-between">
                <span className="font-bold text-blue-950">{t('total')}</span>
                <span className="text-2xl font-extrabold text-blue-950">
                  <span className="text-sm font-semibold text-gray-400 me-1">{t('currency')}</span>
                  {total}
                </span>
              </div>

              <a
                href="/checkout"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('proceedToCheckout')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{t('prescriptionNote')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
