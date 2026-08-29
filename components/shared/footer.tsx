'use client';

import { useTranslations } from 'next-intl';
import { Heart, ArrowRight } from 'lucide-react';

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M15 3h-2a5 5 0 0 0-5 5v2H6v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations('footer');
  const tCat = useTranslations('categories');
  const tNav = useTranslations('navbar');

  return (
    <footer className="text-white" style={{ backgroundColor: '#102d52' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center relative shrink-0">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <div>
                <div className="font-bold leading-tight">{t('title')}</div>
                <div className="text-xs text-blue-200/80 leading-tight" dir="rtl">صيدلية عمر</div>
              </div>
            </div>
            <p className="text-blue-100/70 text-sm">
              {t('description')}
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-blue-100/80 hover:text-white hover:border-white/40 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-blue-100/80 hover:text-white hover:border-white/40 transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-amber-300 mb-4">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-blue-100/70 hover:text-white transition-colors text-sm">
                  {tNav('home')}
                </a>
              </li>
              <li>
                <a href="/products" className="text-blue-100/70 hover:text-white transition-colors text-sm">
                  {tNav('products')}
                </a>
              </li>
              <li>
                <a href="/about" className="text-blue-100/70 hover:text-white transition-colors text-sm">
                  {tNav('about')}
                </a>
              </li>
              <li>
                <a href="/contact" className="text-blue-100/70 hover:text-white transition-colors text-sm">
                  {tNav('contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-amber-300 mb-4">
              {t('categories')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/categories/medicines" className="text-blue-100/70 hover:text-white transition-colors text-sm">
                  {tCat('medicines')}
                </a>
              </li>
              <li>
                <a href="/categories/supplements" className="text-blue-100/70 hover:text-white transition-colors text-sm">
                  {tCat('supplements')}
                </a>
              </li>
              <li>
                <a href="/categories/personal-care" className="text-blue-100/70 hover:text-white transition-colors text-sm">
                  {tCat('personalCare')}
                </a>
              </li>
              <li>
                <a href="/categories/baby-care" className="text-blue-100/70 hover:text-white transition-colors text-sm">
                  {tCat('babyCare')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-amber-300 mb-4">
              {t('visitUs')}
            </h3>
            <ul className="space-y-3">
              <li className="text-blue-100/70 text-sm">12 El-Nasr Street, Cairo, Egypt</li>
              <li className="text-blue-100/70 text-sm">
                <a href="tel:+201000000000" className="hover:text-white transition-colors">
                  01X XXX XXXX
                </a>
              </li>
              <li className="text-blue-100/70 text-sm">{t('hours')}</li>
            </ul>
            <a
              href="tel:+201000000000"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white mt-4 group"
            >
              {t('contactPharmacist')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-100/60 text-sm">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-blue-100/60 text-xs text-center sm:text-end">
            {t('note')}
          </p>
        </div>
      </div>
    </footer>
  );
}
