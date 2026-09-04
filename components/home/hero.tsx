import { getTranslations } from 'next-intl/server';
import { Sparkles, ArrowRight, Phone, ShieldCheck, Truck, Heart, PackageCheck } from 'lucide-react';

export default async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="bg-blue-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-1.5 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold tracking-wider uppercase text-blue-900">
                {t('badge')}
              </span>
            </div>

            <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              <span className="block text-blue-950">{t('titleLine1')}</span>
              <span className="block text-blue-600">{t('titleLine2')}</span>
            </h1>

            <p dir="rtl" className="mt-4 text-2xl font-semibold text-blue-300">
              {t('titleArabic')}
            </p>

            <p className="mt-6 text-lg text-gray-500 max-w-xl">
              {t('description')}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/products"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-full font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
              >
                {t('ctaPrimary')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-950 px-6 py-3.5 rounded-full font-semibold hover:border-blue-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                {t('ctaSecondary')}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>{t('trustProducts')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>{t('trustDelivery')}</span>
              </div>
            </div>
          </div>

          {/* Right column - care kit card */}
          <div className="relative">
            <div className="relative bg-blue-50/60 rounded-3xl shadow-xl p-8 pt-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                  {t('cardLabel')}
                </span>
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {t('cardBadge')}
                </span>
              </div>

              <div className="relative mt-8 flex items-center justify-center">
                <div className="absolute top-0 start-0 bg-blue-950 text-white rounded-2xl px-4 py-3 shadow-lg max-w-[220px] z-10">
                  <div className="text-xs text-blue-200/80">{t('cardNoteLabel')}</div>
                  <div className="text-sm font-semibold">{t('cardNoteValue')}</div>
                </div>

                <div className="w-64 h-64 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-40 h-52 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                    <div className="bg-blue-50 flex-1 flex items-center justify-center">
                      <Heart className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="py-3 text-center">
                      <div className="text-sm font-bold tracking-wide text-blue-950">
                        {t('cardBrand').toUpperCase()}
                      </div>
                      <div className="text-[11px] text-gray-400 tracking-wide">
                        {t('cardBrandSub').toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 end-0 w-14 h-14 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg">
                  <PackageCheck className="w-6 h-6 text-white" />
                </div>
              </div>

              <p className="mt-8 text-center text-blue-700 font-medium border-t border-blue-100 pt-6">
                {t('cardFooter')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
