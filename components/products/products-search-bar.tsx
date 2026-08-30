'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

interface ProductsSearchBarProps {
  placeholder: string;
  submitLabel: string;
}

const DEBOUNCE_MS = 400;

export default function ProductsSearchBar({ placeholder, submitLabel }: ProductsSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') ?? '');
  const [isPending, setIsPending] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();

    if (trimmed) {
      params.set('search', trimmed);
    } else {
      params.delete('search');
    }
    params.delete('page');

    router.replace(`/products${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value === (searchParams.get('search') ?? '')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing pending indicator with debounce state
      setIsPending(false);
      return;
    }

    setIsPending(true);
    debounceRef.current = setTimeout(() => {
      runSearch(value);
      setIsPending(false);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the input value changes
  }, [value]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsPending(false);
    runSearch(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex items-center gap-3 bg-white rounded-full shadow-lg shadow-blue-900/5 p-2 max-w-2xl"
    >
      <Search className="w-5 h-5 text-gray-400 ms-3 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-2.5 text-blue-950 placeholder:text-gray-400 focus:outline-none min-w-0"
      />
      <button
        type="submit"
        className="shrink-0 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-colors"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}
