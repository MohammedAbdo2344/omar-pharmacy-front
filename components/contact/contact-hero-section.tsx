import { getTranslations } from 'next-intl/server';
import { Stethoscope, MessageCircle, ArrowRight } from 'lucide-react';
import type { ConfigData } from '@/services/config/config.interface';

interface ContactHeroSectionProps {
  config?: ConfigData | null;
}

export default async function ContactHeroSection({ config }: ContactHeroSectionProps) {
  const t = await getTranslations('contactHeroSection');

  const phone = config?.phone || '+201000000000';

  return (
    <section className="relative overflow-hidden bg-blue-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
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
              <span className="block text-blue-600">{t('titleLine2')}</span>
              <span className="block text-blue-950">{t('titleLine3')}</span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 max-w-xl">{t('description')}</p>
          </div>

          {/* Right column - pharmacist desk card */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-amber-600">
                    {t('cardBadge')}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-blue-950">{t('cardTitle')}</h3>
                </div>
              </div>

              <p className="mt-6 text-gray-500">{t('cardDescription')}</p>

              <a
                href={`https://wa.me/${phone}`}
                className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-blue-950 text-white px-6 py-4 rounded-full font-semibold hover:bg-blue-900 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {t('cardCta')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
