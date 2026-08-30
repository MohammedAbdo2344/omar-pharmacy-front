import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import ProductCard, { type ProductListItem } from './product-card';

interface ProductRelatedSectionProps {
  products: ProductListItem[];
}

export default async function ProductRelatedSection({ products }: ProductRelatedSectionProps) {
  const t = await getTranslations('productDetailPage');
  const tShelf = await getTranslations('productsShelfSection');
  const tResults = await getTranslations('productsResultsSection');

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
                {t('relatedBadge')}
              </span>
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-blue-950">{t('relatedTitle')}</h2>
          </div>

          <a
            href="/products"
            className="inline-flex items-center gap-1.5 font-semibold text-blue-950 hover:text-blue-600 transition-colors"
          >
            {t('viewAllProducts')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              labels={{
                currency: tResults('currency'),
                off: (percent) => tResults('off', { percent }),
                bestSeller: tShelf('bestSeller'),
                popular: tShelf('popular'),
                new: tShelf('new'),
                prescriptionNote: tShelf('prescriptionNote'),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
