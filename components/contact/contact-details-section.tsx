import { getTranslations } from 'next-intl/server';
import { Phone, MessageCircle, MapPin, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import type { ConfigData } from '@/services/config/config.interface';
import CopyAddressButton from './copy-address-button';
import ContactNoteForm from './contact-note-form';

interface ContactDetailsSectionProps {
  config?: ConfigData | null;
}

export default async function ContactDetailsSection({ config }: ContactDetailsSectionProps) {
  const t = await getTranslations('contactDetailsSection');

  const address = config?.address || '12 El-Nasr Street, Cairo, Egypt';
  const phone = config?.phone || '+201000000000';
  const whatsapp = config?.whatsapp || phone;
  const workingHours = config?.working_hours || t('hoursFallback');
  const mapsUrl = config?.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column */}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
                {t('badge')}
              </span>
            </div>

            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-blue-950 leading-tight">
              {t('title')}
            </h2>

            <p className="mt-4 text-gray-500 max-w-md">{t('description')}</p>

            <div className="mt-8 space-y-4">
              <a
                href={`tel:${phone}`}
                className="group flex items-center gap-4 bg-blue-50/60 rounded-2xl px-6 py-5 hover:bg-blue-50 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                    {t('callLabel')}
                  </div>
                  <div className="font-bold text-blue-950">{phone}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 rtl:rotate-180 transition-colors" />
              </a>

              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-green-50 rounded-2xl px-6 py-5 hover:bg-green-100 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                    {t('whatsappLabel')}
                  </div>
                  <div className="font-bold text-green-950">{whatsapp}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 rtl:rotate-180 transition-colors" />
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 text-amber-700">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-semibold tracking-widest uppercase">{t('visitLabel')}</span>
                </div>
                <p className="mt-2 text-blue-950 font-medium">{address}</p>
                <div className="mt-2">
                  <CopyAddressButton address={address} label={t('copyAddress')} copiedLabel={t('copied')} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-amber-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-semibold tracking-widest uppercase">{t('hoursLabel')}</span>
                </div>
                <p className="mt-2 text-blue-950 font-medium">{workingHours}</p>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {t('openNow')}
                </a>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Map card */}
            <div className="relative rounded-3xl overflow-hidden bg-blue-50 aspect-[16/10] border border-blue-100">
              <svg
                className="absolute inset-0 w-full h-full text-blue-200"
                viewBox="0 0 400 260"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
              >
                <path d="M0 40 L400 90" stroke="currentColor" strokeWidth="3" />
                <path d="M0 150 L400 120" stroke="currentColor" strokeWidth="3" />
                <path d="M60 0 L120 260" stroke="currentColor" strokeWidth="3" />
                <path d="M280 0 L340 260" stroke="currentColor" strokeWidth="3" />
                <path d="M-20 20 C 80 -20, 140 260, 260 60 S 420 200, 460 40" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              </svg>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 end-4 inline-flex items-center gap-1.5 bg-white text-blue-950 text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow transition-shadow"
              >
                {t('openInMaps')}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center rtl:translate-x-1/2">
                <div className="w-11 h-11 rounded-full rounded-bl-sm bg-blue-600 rotate-45 flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5 text-white -rotate-45" />
                </div>
                <div className="mt-2 bg-blue-950 text-white text-sm font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                  {config?.name || t('pharmacyName')}
                </div>
              </div>

              <div className="absolute bottom-4 start-4 bg-white/90 backdrop-blur text-blue-950 text-xs font-semibold px-3 py-1.5 rounded-full">
                {address}
              </div>
            </div>

            {/* Note form */}
            <ContactNoteForm
              labels={{
                title: t('formTitle'),
                subtitle: t('formSubtitle'),
                nameLabel: t('nameLabel'),
                namePlaceholder: t('namePlaceholder'),
                phoneLabel: t('phoneLabel'),
                phonePlaceholder: t('phonePlaceholder'),
                messageLabel: t('messageLabel'),
                messagePlaceholder: t('messagePlaceholder'),
                submit: t('submit'),
                sending: t('sending'),
                sendSuccess: t('sendSuccess'),
                sendError: t('sendError'),
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
