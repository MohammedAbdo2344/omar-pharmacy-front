'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, ChevronDown } from 'lucide-react';
import type { CategoryRecord } from '@/services/categories/categories.interface';

const PRICE_CEILING = 1000;
const DEBOUNCE_MS = 350;

interface ProductsFiltersSidebarProps {
  categories: CategoryRecord[];
  /** Whether the "Available on request" filter entry should be offered. */
  showRequestOnly?: boolean;
  labels: {
    title: string;
    reset: string;
    allProducts: string;
    requestOnly: string;
    priceUpTo: string;
    priceNoLimit: string;
  };
}

export default function ProductsFiltersSidebar({
  categories,
  showRequestOnly = false,
  labels,
}: ProductsFiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategoryId = searchParams.get('category_id') ?? '';
  const activeSubcategoryId = searchParams.get('subcategory_id') ?? '';
  const isRequestOnlyActive = searchParams.get('availability_type') === 'request_only';
  const urlMaxPrice = searchParams.get('max_price');

  const [maxPrice, setMaxPrice] = useState(urlMaxPrice ? Number(urlMaxPrice) : PRICE_CEILING);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Per-category manual open/close overrides; falls back to auto-open when active. */
  const [openOverrides, setOpenOverrides] = useState<Record<number, boolean>>({});

  const toggleCategory = (categoryId: number, autoOpen: boolean) => {
    setOpenOverrides((prev) => ({
      ...prev,
      [categoryId]: !(prev[categoryId] ?? autoOpen),
    }));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing slider with URL state (e.g. after Reset)
    setMaxPrice(urlMaxPrice ? Number(urlMaxPrice) : PRICE_CEILING);
  }, [urlMaxPrice]);

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete('page');
    router.replace(`/products${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const handleCategorySelect = (categoryId: number | null) => {
    pushParams((params) => {
      params.delete('subcategory_id');
      params.delete('availability_type');
      if (categoryId) {
        params.set('category_id', String(categoryId));
      } else {
        params.delete('category_id');
      }
    });
  };

  const handleSubcategorySelect = (subcategoryId: number) => {
    pushParams((params) => {
      params.delete('category_id');
      params.delete('availability_type');
      params.set('subcategory_id', String(subcategoryId));
    });
  };

  const handleRequestOnlySelect = () => {
    pushParams((params) => {
      params.delete('category_id');
      params.delete('subcategory_id');
      params.set('availability_type', 'request_only');
    });
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setMaxPrice(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams((params) => {
        if (next >= PRICE_CEILING) {
          params.delete('max_price');
        } else {
          params.set('max_price', String(next));
        }
      });
    }, DEBOUNCE_MS);
  };

  const handleReset = () => {
    setMaxPrice(PRICE_CEILING);
    router.replace('/products', { scroll: false });
  };

  return (
    <aside className="bg-white rounded-3xl border border-gray-100 p-6 h-fit">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase text-blue-900">
          {labels.title}
        </span>
        <button
          onClick={handleReset}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {labels.reset}
        </button>
      </div>

      <div className="mt-4 space-y-1">
        <button
          onClick={() => handleCategorySelect(null)}
          className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            !activeCategoryId && !activeSubcategoryId && !isRequestOnlyActive
              ? 'bg-blue-50 text-blue-700'
              : 'text-blue-950 hover:bg-gray-50'
          }`}
        >
          {labels.allProducts}
          {!activeCategoryId && !activeSubcategoryId && !isRequestOnlyActive && <Check className="w-4 h-4" />}
        </button>

        {categories.map((category) => {
          const isActive = activeCategoryId === String(category.id);
          const subcategories = category.subcategories ?? [];
          const hasActiveSub = subcategories.some((s) => activeSubcategoryId === String(s.id));
          const autoOpen = isActive || hasActiveSub;
          const isOpen = subcategories.length > 0 && (openOverrides[category.id] ?? autoOpen);

          return (
            <div key={category.id}>
              <div
                className={`flex items-center rounded-xl transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-blue-950 hover:bg-gray-50'
                }`}
              >
                <button
                  onClick={() => handleCategorySelect(category.id)}
                  className="flex-1 flex items-center justify-between ps-4 py-3 text-sm font-semibold"
                >
                  {category.name}
                  {isActive && <Check className="w-4 h-4" />}
                </button>
                {subcategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id, autoOpen)}
                    aria-expanded={isOpen}
                    aria-label={`Toggle ${category.name} subcategories`}
                    className="px-3 py-3 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>

              {subcategories.length > 0 && (
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="ms-3 ps-2 border-s border-gray-100 mt-1">
                      {subcategories.map((sub) => {
                        const subActive = activeSubcategoryId === String(sub.id);
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubcategorySelect(sub.id)}
                            className={`w-full flex items-center justify-between rounded-xl px-4 py-2 text-sm transition-colors ${
                              subActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-blue-950/80 hover:bg-gray-50'
                            }`}
                          >
                            {sub.name}
                            {subActive && <Check className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {(showRequestOnly || isRequestOnlyActive) && (
          <button
            onClick={handleRequestOnlySelect}
            className={`mt-1 w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isRequestOnlyActive ? 'bg-amber-50 text-amber-700' : 'text-amber-700/90 hover:bg-amber-50/60'
            }`}
          >
            {labels.requestOnly}
            {isRequestOnlyActive && <Check className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-blue-950">{labels.priceUpTo}</span>
          <span className="text-sm font-bold text-blue-600">
            {maxPrice >= PRICE_CEILING ? labels.priceNoLimit : `EGP ${maxPrice}`}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={PRICE_CEILING}
          step={10}
          value={maxPrice}
          onChange={handlePriceChange}
          className="mt-4 w-full accent-blue-600 cursor-pointer"
        />

        <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
          <span>EGP 0</span>
          <span>{labels.priceNoLimit}</span>
        </div>
      </div>
    </aside>
  );
}
