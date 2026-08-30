import { getTranslations } from 'next-intl/server';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import type { ConfigData } from '@/services/config/config.interface';

interface PharmacistGuidanceSectionProps {
  config?: ConfigData | null;
}

export default async function PharmacistGuidanceSection({ config }: PharmacistGuidanceSectionProps) {
  const t = await getTranslations('pharmacistGuidanceSection');

  const phone = config?.phone || '+201000000000';

  return (
    <section className="py-16 bg-amber-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-700">
                {t('badge')}
              </span>
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-serif text-blue-950 max-w-2xl leading-tight">
              {t('title')}
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl">{t('description')}</p>
          </div>

          <a
            href={`https://wa.me/${phone}`}
            className="shrink-0 inline-flex items-center gap-2 bg-blue-950 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-blue-900 transition-colors"
          >
            {t('cta')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>
  );
}
