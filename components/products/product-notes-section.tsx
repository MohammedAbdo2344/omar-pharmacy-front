import { getTranslations } from 'next-intl/server';
import { ShieldCheck, MessageCircle, Truck, Clock, ShieldCheck as ShieldIcon } from 'lucide-react';
import { stripHtml } from '@/lib/strip-html';
import type { ProductDetail } from './product-detail.types';
import type { ConfigData } from '@/services/config/config.interface';

interface ProductNotesSectionProps {
  product: ProductDetail;
  config?: ConfigData | null;
}

export default async function ProductNotesSection({ product, config }: ProductNotesSectionProps) {
  const t = await getTranslations('productDetailPage');

  const phone = config?.phone || config?.whatsapp || '';
  const workingHours = config?.working_hours || t('hoursFallback');

  const attributes = [
    { label: t('brand'), value: product.brand },
    { label: t('category'), value: product.category_name },
    { label: t('packSize'), value: product.tablet_count },
    { label: t('manufacturer'), value: product.manufacturer },
  ].filter((attribute) => attribute.value);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
                {t('notesBadge')}
              </span>
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-blue-950 leading-tight">
              {t('notesTitle')}
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl break-words">
              {product.description ? stripHtml(product.description) : t('notesFallback', { name: product.name })}
            </p>

            {attributes.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 max-w-lg">
                {attributes.map((attribute) => (
                  <div key={attribute.label} className="bg-gray-50/70 border border-gray-100 rounded-2xl p-5">
                    <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
                      {attribute.label}
                    </div>
                    <div className="mt-1 font-bold text-blue-950">{attribute.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Responsible note */}
          <div className="bg-amber-50 rounded-3xl p-6 sm:p-8">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-blue-950">{t('responsibleNoteTitle')}</h3>
            <p className="mt-2 text-amber-900/80">
              {product.requires_prescription ? t('responsibleNoteRequired') : t('responsibleNoteGeneral')}
            </p>

            {phone && (
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 bg-white text-blue-950 px-5 py-3 rounded-full font-semibold shadow-sm hover:shadow transition-shadow"
              >
                <MessageCircle className="w-4 h-4 text-blue-600" />
                {t('askPharmacist')}
              </a>
            )}
          </div>
        </div>

        {/* Trust row */}
        <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-blue-950 text-sm">{t('trustDeliveryTitle')}</div>
              <div className="text-xs text-gray-400">{t('trustDeliverySubtitle')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-blue-950 text-sm">{t('trustHoursTitle')}</div>
              <div className="text-xs text-gray-400">{workingHours}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-blue-950 text-sm">{t('trustPharmacistTitle')}</div>
              <div className="text-xs text-gray-400">{t('trustPharmacistSubtitle')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
