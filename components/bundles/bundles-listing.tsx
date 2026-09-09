import { getTranslations } from 'next-intl/server';
import { PackageSearch } from 'lucide-react';
import type { BundleRecord } from '@/services/bundles/bundles.interface';
import BundleCard from './bundle-card';

interface BundlesListingProps {
  bundles: BundleRecord[];
}

export default async function BundlesListing({ bundles }: BundlesListingProps) {
  const t = await getTranslations('bundlesPage');

  const cardLabels = {
    currency: t('currency'),
    save: (amount: string) => t('save', { amount }),
    contains: t('contains'),
    bundleTag: t('bundleTag'),
    add: t('addToCart'),
    added: t('addedToCart'),
    unavailable: t('unavailable'),
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">{t('badge')}</span>
        </div>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-blue-950">{t('title')}</h1>
        <p className="mt-3 text-gray-500 max-w-xl">{t('subtitle')}</p>

        {bundles.length === 0 ? (
          <div className="mt-10 bg-blue-50/40 rounded-3xl border border-blue-100 p-16 text-center">
            <PackageSearch className="w-10 h-10 text-blue-300 mx-auto" />
            <h3 className="mt-4 text-xl font-bold text-blue-950">{t('emptyTitle')}</h3>
            <p className="mt-2 text-gray-500">{t('emptyDescription')}</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} labels={cardLabels} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
