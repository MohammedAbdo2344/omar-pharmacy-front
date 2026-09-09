'use client';

import { useTranslations } from 'next-intl';
import { Clock, MapPin, ShieldCheck, ArrowRight, Phone, Truck } from 'lucide-react';
import { useConfig } from '@/providers/config-provider';

export default function WhyOmarSection() {
  const t = useTranslations('whyOmarSection');
  const { config } = useConfig();

  const address = config?.address || '12 El-Nasr Street, Cairo, Egypt';
  const workingHours = config?.working_hours || 'Open daily · 8:00 AM — 12:00 AM';
  const phone = config?.phone || '+201000000000';

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main card */}
          <div className="bg-blue-950 rounded-3xl p-8 flex flex-col justify-between text-white row-span-2">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold tracking-widest uppercase text-white/60">
                  {t('badge')}
                </span>
              </div>
              <h2 className="text-3xl font-extrabold leading-tight">
                {t('title1')}
                <br />
                {t('title2')}{' '}
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 align-middle" />
              </h2>
              <p className="mt-4 text-white/70">{t('description')}</p>
            </div>
            <a
              href="/about"
              className="mt-8 inline-flex items-center gap-1 text-amber-300 font-semibold hover:text-amber-200 transition-colors"
            >
              {t('meetTeam')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>
          </div>

          {/* Hours card */}
          <div className="bg-amber-50 rounded-3xl p-8 flex items-center gap-6">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">{t('hoursTitle')}</h3>
              <p className="text-gray-500 text-sm">{workingHours}</p>
            </div>
          </div>

          {/* Location card */}
          <div className="bg-blue-50 rounded-3xl p-8 flex items-center gap-6">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <MapPin className="w-5 h-5 text-blue-950" />
            </div>
            <div>
              <h3 className="font-bold text-blue-950 mb-1">{t('locationTitle')}</h3>
              <p className="text-gray-500 text-sm">{address}</p>
            </div>
          </div>

          {/* Delivery card - landscape under Hours and Location */}
          <div className="md:col-start-2 md:col-span-2 bg-emerald-50 rounded-3xl p-8 flex items-center gap-6">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <Truck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 mb-1">{t('deliveryTitle')}</h3>
              <p className="text-gray-500 text-sm">{t('deliveryDescription')}</p>
            </div>
          </div>
        </div>

        {/* Responsible note */}
        <div className="mt-6 bg-amber-50/70 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-700">
                {t('noteBadge')}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-amber-950">{t('noteTitle')}</h3>
            <p className="mt-2 text-gray-500 max-w-2xl">{t('noteDescription')}</p>
          </div>
          <a
            href={`https://wa.me/${phone}`}
            className="shrink-0 inline-flex items-center gap-2 bg-blue-950 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-blue-900 transition-colors"
          >
            <Phone className="w-4 h-4" />
            {t('contactPharmacist')}
          </a>
        </div>
      </div>
    </section>
  );
}
