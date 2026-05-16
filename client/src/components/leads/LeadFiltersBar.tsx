import { LeadFilters, LeadStatus, LeadSource } from '../../types/lead.types';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Props {
  filters: LeadFilters;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (patch: Partial<LeadFilters>) => void;
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'lost', label: 'Lost' },
];

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'referral', label: 'Referral' },
];

export const LeadFiltersBar = ({
  filters,
  searchValue,
  onSearchChange,
  onFilterChange,
}: Props) => {
  const activeFilterCount = [filters.status, filters.source].filter(Boolean).length;

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            id="leads-search"
            type="text"
            placeholder="Search by name or email…"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10"
            aria-label="Search leads"
          />
        </div>

        {/* Filters indicator */}
        <div className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>

        {/* Status Filter */}
        <select
          id="leads-filter-status"
          value={filters.status ?? ''}
          onChange={(e) =>
            onFilterChange({ status: (e.target.value as LeadStatus) || undefined })
          }
          className="select"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Source Filter */}
        <select
          id="leads-filter-source"
          value={filters.source ?? ''}
          onChange={(e) =>
            onFilterChange({ source: (e.target.value as LeadSource) || undefined })
          }
          className="select"
          aria-label="Filter by source"
        >
          <option value="">All Sources</option>
          {SOURCE_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          id="leads-sort"
          value={filters.sort ?? 'latest'}
          onChange={(e) =>
            onFilterChange({ sort: e.target.value as 'latest' | 'oldest' })
          }
          className="select"
          aria-label="Sort leads"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {/* Clear filters */}
        {activeFilterCount > 0 && (
          <button
            onClick={() => onFilterChange({ status: undefined, source: undefined })}
            className="btn-ghost text-xs text-brand-600 dark:text-brand-400"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
