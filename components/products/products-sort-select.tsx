'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

interface ProductsSortSelectProps {
  label: string;
  options: { value: string; label: string }[];
}

export default function ProductsSortSelect({ label, options }: ProductsSortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort_by_price') ?? '';

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (event.target.value) {
      params.set('sort_by_price', event.target.value);
    } else {
      params.delete('sort_by_price');
    }
    params.delete('page');
    router.replace(`/products${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  return (
    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-4 pr-3 py-2 shadow-sm">
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-500">{label}</span>
      <div className="relative">
        <select
          value={current}
          onChange={handleChange}
          className="appearance-none bg-transparent pr-6 text-sm font-semibold text-blue-950 focus:outline-none cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
