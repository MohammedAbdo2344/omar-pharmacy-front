'use client';

import { useConfig } from '@/providers/config-provider';
import { useTranslations } from 'next-intl';

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

const DEFAULT_PHONE_NUMBER = '201000000000';

export default function PhoneButton() {
  const { config } = useConfig();
  const t = useTranslations('phoneButton');
  const digits = config?.phone?.replace(/\D/g, '');
  const number = digits || DEFAULT_PHONE_NUMBER;

  return (
    <a
      href={`tel:${number}`}
      aria-label={t('ariaLabel')}
      className="fixed bottom-20 right-5 z-50 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
    >
      <PhoneIcon className="w-7 h-7" />
    </a>
  );
}
