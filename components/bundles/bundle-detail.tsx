import { getTranslations } from 'next-intl/server';
import { ChevronRight, PackagePlus, Tag } from 'lucide-react';
import { resolveAssetUrl } from '@/lib/api/asset-url';
import type { BundleRecord } from '@/services/bundles/bundles.interface';
import AddBundleToCartButton from './add-bundle-to-cart-button';

interface BundleDetailProps {
  bundle: BundleRecord;
}

export default async function BundleDetail({ bundle }: BundleDetailProps) {
  const t = await getTranslations('bundlesPage');

  const imageUrl = resolveAssetUrl(bundle.image_url);
  const separately = bundle.components_total_price;
  const savings = separately - bundle.price;
  const savingsPercent = separately > 0 ? Math.round((savings / separately) * 100) : 0;
  const hasSavings = savings > 0;
  const currency = t('currency');

  return (
    <section className="bg-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <a href="/bundles" className="hover:text-blue-600 transition-colors">{t('breadcrumb')}</a>
          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          <span className="font-semibold text-blue-950">{bundle.name}</span>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <div className="rounded-3xl bg-purple-50/70 border border-purple-100 p-10 flex items-center justify-center h-80">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={bundle.name} className="max-h-full object-contain drop-shadow-lg" />
              ) : (
                <PackagePlus className="w-16 h-16 text-purple-400" />
              )}
            </div>

            {hasSavings && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 px-5 py-4">
                <Tag className="w-5 h-5 text-emerald-700 shrink-0" />
                <p className="text-sm text-emerald-900">
                  {t('savingsPitch', { amount: savings.toFixed(2), percent: savingsPercent })}
                </p>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-purple-100 text-purple-700">
              {t('bundleTag')}
            </span>
            {!bundle.is_available && (
              <span className="ms-2 inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-500">
                {t('unavailable')}
              </span>
            )}

            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-blue-950 leading-tight">
              {bundle.name}
            </h1>

            {bundle.description && (
              <p className="mt-5 text-lg text-gray-500 max-w-xl">{bundle.description}</p>
            )}

            {/* Price breakdown card */}
            <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-400">
                  {t('priceBreakdown')}
                </h2>
                {hasSavings && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {t('savePercent', { percent: savingsPercent })}
                  </span>
                )}
              </div>

              <ul className="mt-4 divide-y divide-gray-100">
                {bundle.items.map((item) => {
                  const lineTotal = item.unit_price * item.quantity;
                  return (
                    <li key={item.product_id} className="flex items-center gap-3 py-3">
                      <span className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.primary_image?.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={resolveAssetUrl(item.primary_image.image_url) ?? undefined}
                            alt=""
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <PackagePlus className="w-4 h-4 text-gray-300" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <a
                          href={`/products/${item.slug}`}
                          className="font-semibold text-blue-950 hover:text-blue-600 line-clamp-1"
                        >
                          {item.name}
                        </a>
                        <div className="text-xs text-gray-400">
                          {t('lineQuantity', { quantity: item.quantity })} · {currency} {item.unit_price.toFixed(2)}{' '}
                          {t('each')}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-500 shrink-0">
                        {currency} {lineTotal.toFixed(2)}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-2 pt-4 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-500">
                  <span>{t('ifBoughtSeparately')}</span>
                  <span className={hasSavings ? 'line-through' : ''}>
                    {currency} {separately.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold text-blue-950">
                  <span>{t('bundlePrice')}</span>
                  <span className="text-lg">{currency} {bundle.price.toFixed(2)}</span>
                </div>
                {hasSavings && (
                  <div className="flex items-center justify-between font-semibold text-emerald-700">
                    <span>{t('youSave')}</span>
                    <span>{currency} {savings.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <AddBundleToCartButton
                bundleId={bundle.id}
                isAvailable={bundle.is_available}
                maxQuantity={bundle.max_available_quantity}
                variant="full"
                labels={{ add: t('addToCart'), added: t('addedToCart'), unavailable: t('unavailable') }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
