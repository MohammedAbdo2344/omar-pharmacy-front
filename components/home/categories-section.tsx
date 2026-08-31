import { getTranslations } from 'next-intl/server';
import { Stethoscope, ArrowRight } from 'lucide-react';
import type { HomeCategory } from '@/services/home/home.interface';
import { resolveAssetUrl } from '@/lib/api/asset-url';

interface CategoriesSectionProps {
  categories: HomeCategory[];
}

const DEFAULT_CATEGORY_COLOR = '#ffe9ef';

function getCategoryStyle(color: string | null) {
  const backgroundColor = color || DEFAULT_CATEGORY_COLOR;
  return {
    style: { backgroundColor },
    textClass: 'text-blue-950',
    subTextClass: 'text-blue-700',
  };
}

export default async function CategoriesSection({ categories }: CategoriesSectionProps) {
  const t = await getTranslations('categoriesSection');

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                {t('badge')}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950">
              {t('title')}
            </h2>
          </div>
          <a
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            {t('browseAll')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </a>
        </div>

        <a
          href="/products"
          className="sm:hidden mb-8 inline-flex items-center gap-1 text-blue-600 font-semibold"
        >
          {t('browseAll')}
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </a>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const categoryStyle = getCategoryStyle(category.color);
            return (
              <a
                key={category.id}
                style={categoryStyle.style}
                className="rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm mb-5">
                  {category.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveAssetUrl(category.image) ?? undefined} alt="" className="w-6 h-6 object-contain" />
                  ) : (
                    <Stethoscope className="w-5 h-5" />
                  )}
                </div>
                <h3 className={`font-bold ${categoryStyle.textClass}`}>{category.name}</h3>
                <p className={`text-xs ${categoryStyle.subTextClass} mt-1`}>{category.products_count} {t('products')}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
