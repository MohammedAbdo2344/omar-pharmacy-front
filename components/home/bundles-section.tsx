import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import type { BundleRecord } from '@/services/bundles/bundles.interface';
import BundleCard from '@/components/bundles/bundle-card';

interface BundlesSectionProps {
  bundles: BundleRecord[];
}

export default async function BundlesSection({ bundles }: BundlesSectionProps) {
  const t = await getTranslations('bundlesPage');

  if (bundles.length === 0) return null;

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
    <section className="py-16 bg-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                {t('badge')}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950">{t('title')}</h2>
          </div>
          <a
            href="/bundles"
            className="hidden sm:inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            {t('seeAll')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.slice(0, 3).map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} labels={cardLabels} />
          ))}
        </div>
      </div>
    </section>
  );
}
