import { PaginationMeta } from '../../types/lead.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ meta, onPageChange }: Props) => {
  const { page, totalPages, total, limit } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-surface-500 dark:text-surface-400">
        Showing <span className="font-medium text-surface-700 dark:text-surface-200">{from}</span> to{' '}
        <span className="font-medium text-surface-700 dark:text-surface-200">{to}</span> of{' '}
        <span className="font-medium text-surface-700 dark:text-surface-200">{total}</span> results
      </p>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          id="pagination-prev"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="btn-icon disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-surface-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`btn min-w-[36px] h-9 text-sm rounded-lg ${
                p === page
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          id="pagination-next"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="btn-icon disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
};
