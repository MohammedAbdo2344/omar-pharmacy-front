import { getTranslations } from 'next-intl/server';
import ProductsSearchBar from './products-search-bar';

export default async function ProductsHeroSection() {
  const t = await getTranslations('productsHeroSection');

  return (
    <section className="relative overflow-hidden bg-blue-50/40 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
            {t('badge')}
          </span>
        </div>

        <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight max-w-3xl">
          <span className="text-blue-950">{t('titlePrefix')} </span>
          <span className="text-blue-600">{t('titleHighlight')}</span>
        </h1>

        <p className="mt-6 text-lg text-gray-500 max-w-xl">{t('description')}</p>

        <ProductsSearchBar placeholder={t('searchPlaceholder')} submitLabel={t('searchSubmit')} />
      </div>
    </section>
  );
}
