'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';
import type { CategoryRecord } from '@/services/categories/categories.interface';

const PRICE_CEILING = 1000;
const DEBOUNCE_MS = 350;

interface ProductsFiltersSidebarProps {
  categories: CategoryRecord[];
  labels: {
    title: string;
    reset: string;
    allProducts: string;
    priceUpTo: string;
    priceNoLimit: string;
  };
}

export default function ProductsFiltersSidebar({ categories, labels }: ProductsFiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategoryId = searchParams.get('category_id') ?? '';
  const urlMaxPrice = searchParams.get('max_price');

  const [maxPrice, setMaxPrice] = useState(urlMaxPrice ? Number(urlMaxPrice) : PRICE_CEILING);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (categoryId) {
        params.set('category_id', String(categoryId));
      } else {
        params.delete('category_id');
      }
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
            !activeCategoryId ? 'bg-blue-50 text-blue-700' : 'text-blue-950 hover:bg-gray-50'
          }`}
        >
          {labels.allProducts}
          {!activeCategoryId && <Check className="w-4 h-4" />}
        </button>

        {categories.map((category) => {
          const isActive = activeCategoryId === String(category.id);
          return (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-blue-950 hover:bg-gray-50'
              }`}
            >
              {category.name}
              {isActive && <Check className="w-4 h-4" />}
            </button>
          );
        })}
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
