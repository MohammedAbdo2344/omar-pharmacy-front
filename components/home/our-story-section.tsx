import { getTranslations } from 'next-intl/server';
import { ArrowRight, Phone, ShieldCheck, MapPin, Clock, Sparkles, Pill, Heart } from 'lucide-react';
import type { ConfigData } from '@/services/config/config.interface';

interface OurStorySectionProps {
  config?: ConfigData | null;
}

export default async function OurStorySection({ config }: OurStorySectionProps) {
  const t = await getTranslations('ourStorySection');

  const workingHours = config?.working_hours || t('hoursFallback');

  return (
    <section className="py-16 bg-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
                {t('badge')}
              </span>
            </div>

            <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              <span className="block text-blue-950">{t('titleLine1')}</span>
              <span className="block text-blue-600 italic">{t('titleLine2')}</span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 max-w-xl">{t('description')}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/about"
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

            <div className="mt-10 pt-6 border-t border-blue-100 flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>{t('trustService')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>{t('trustLocation')}</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="relative">
            <div className="relative bg-blue-950 rounded-3xl shadow-xl p-8 text-white overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase text-amber-300">
                  {t('cardLabel')}
                </span>
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-extrabold leading-snug max-w-xs">
                {t('cardTitle')}
              </h2>

              <div className="relative mt-8">
                <div className="bg-blue-50 rounded-2xl p-6 text-blue-950 w-3/4 mb-15">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Pill className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">
                      {t('shelfNoteLabel')}
                    </span>
                  </div>
                  <div className="mt-8 text-xl font-extrabold">
                    {t('shelfNoteTitle')}
                  </div>
                  <div className="mt-3 w-10 h-0.5 bg-amber-400" />
                </div>

                {/* <div className="absolute -bottom-6 end-0 w-2/4 h-32 mt-15 rounded-2xl bg-amber-100 border-4 border-amber-200 shadow-lg flex items-center justify-center">
                  <div className="w-16 h-24 bg-white rounded-xl shadow flex flex-col items-center justify-center">
                    <Heart className="w-5 h-5 text-blue-600" />
                    <div className="mt-1 text-[10px] font-bold text-blue-950">{t('cardBrand')}</div>
                  </div>
                </div> */}

                {/* <div className="absolute -bottom-8 -start-2 w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center shadow-lg">
                  <Heart className="w-4 h-4 text-blue-700" />
                </div> */}
              </div>
            </div>

            {/* Working hours card */}
            <div className="absolute -bottom-6 -start-4 sm:start-4 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3 max-w-[240px]">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-blue-950">{t('hoursTitle')}</div>
                <div className="text-xs text-gray-500">{workingHours}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
