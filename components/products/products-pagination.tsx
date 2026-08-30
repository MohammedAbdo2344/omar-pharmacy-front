'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductsPaginationProps {
  currentPage: number;
  lastPage: number;
}

export default function ProductsPagination({ currentPage, lastPage }: ProductsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-10 h-10 rounded-full border border-blue-100 flex items-center justify-center text-blue-950 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
      </button>

      <span className="text-sm font-semibold text-blue-950">
        {currentPage} / {lastPage}
      </span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= lastPage}
        className="w-10 h-10 rounded-full border border-blue-100 flex items-center justify-center text-blue-950 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
      </button>
    </div>
  );
}
