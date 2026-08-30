import { getTranslations } from 'next-intl/server';
import { PackageSearch } from 'lucide-react';
import type { ProductListData } from '@/services/products/products.interface';
import type { CategoryRecord } from '@/services/categories/categories.interface';
import ProductsFiltersSidebar from './products-filters-sidebar';
import ProductsSortSelect from './products-sort-select';
import ProductsPagination from './products-pagination';
import ProductCard, { type ProductListItem } from './product-card';

interface ProductsShelfSectionProps {
  data: ProductListData | null;
  categories: CategoryRecord[];
  search?: string;
  categoryId?: string;
  maxPrice?: string;
}

export default async function ProductsShelfSection({
  data,
  categories,
  search,
  categoryId,
  maxPrice,
}: ProductsShelfSectionProps) {
  const t = await getTranslations('productsShelfSection');
  const tResults = await getTranslations('productsResultsSection');

  const products = (data?.products ?? []) as unknown as ProductListItem[];
  const pagination = data?.pagination;
  const total = pagination?.total ?? products.length;

  const selectedCategory = categoryId ? categories.find((c) => String(c.id) === categoryId) : undefined;
  const categoryLabel = selectedCategory ? selectedCategory.name : t('allCategories');
  const priceLabel = maxPrice ? t('priceMaximum', { amount: maxPrice }) : null;

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
                {t('badge')}
              </span>
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-blue-950">{t('title')}</h2>
            <p className="mt-1 text-gray-500">
              {search
                ? tResults('resultsForSearch', { count: total, query: search })
                : t('itemsCount', { count: total })}
            </p>
          </div>

          <ProductsSortSelect
            label={t('sortBy')}
            options={[
              { value: '', label: t('sortFeatured') },
              { value: 'low_to_high', label: t('sortLowToHigh') },
              { value: 'high_to_low', label: t('sortHighToLow') },
            ]}
          />
        </div>

        <div className="mt-8 pb-6 border-b border-gray-100 flex items-center gap-2 text-sm text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <span>{t('showingCategory', { category: categoryLabel })}</span>
          {priceLabel && (
            <>
              <span className="text-gray-300">/</span>
              <span>{priceLabel}</span>
            </>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          <ProductsFiltersSidebar
            categories={categories}
            labels={{
              title: t('filterShelf'),
              reset: t('reset'),
              allProducts: t('allProducts'),
              priceUpTo: t('priceUpTo'),
              priceNoLimit: t('priceNoLimit'),
            }}
          />

          <div>
            {products.length === 0 ? (
              <div className="bg-blue-50/40 rounded-3xl border border-blue-100 p-16 text-center">
                <PackageSearch className="w-10 h-10 text-blue-300 mx-auto" />
                <h3 className="mt-4 text-xl font-bold text-blue-950">{tResults('emptyTitle')}</h3>
                <p className="mt-2 text-gray-500">{tResults('emptyDescription')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    labels={{
                      currency: tResults('currency'),
                      off: (percent) => tResults('off', { percent }),
                      bestSeller: t('bestSeller'),
                      popular: t('popular'),
                      new: t('new'),
                      prescriptionNote: t('prescriptionNote'),
                    }}
                  />
                ))}
              </div>
            )}

            {pagination && pagination.last_page > 1 && (
              <ProductsPagination currentPage={pagination.current_page} lastPage={pagination.last_page} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
