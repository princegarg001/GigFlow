import { Lead } from '../../types/lead.types';
import { StatusBadge } from '../ui/StatusBadge';
import { SourceBadge } from '../ui/SourceBadge';
import { SkeletonRows } from '../ui/SkeletonRows';
import { formatDate } from '../../utils/formatDate';
import { Eye, Pencil, Trash2, AlertCircle, Inbox } from 'lucide-react';

interface Props {
  leads?: Lead[];
  isLoading: boolean;
  isError: boolean;
  isAdmin: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const TABLE_HEADERS = ['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'];

export const LeadsTable = ({ leads, isLoading, isError, isAdmin, onView, onEdit, onDelete }: Props) => {
  // Error state
  if (isError) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 px-6">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-1">
          Failed to load leads
        </h3>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Something went wrong. Please try refreshing the page.
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading) return <SkeletonRows count={8} cols={TABLE_HEADERS.length} />;

  // Empty state
  if (!leads?.length) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 px-6">
        <div className="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
          <Inbox className="w-6 h-6 text-surface-400" />
        </div>
        <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-1">
          No leads found
        </h3>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Try adjusting your filters or create a new lead.
        </p>
      </div>
    );
  }

  // Data table
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" id="leads-table">
          <thead>
            <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50/80 dark:bg-surface-900/50">
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className="py-3.5 px-5 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800/50">
            {leads.map((lead, idx) => (
              <tr
                key={lead._id}
                className="group hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors animate-fade-in cursor-pointer"
                style={{ animationDelay: `${idx * 30}ms` }}
                onClick={() => onView(lead)}
              >
                {/* Name + Avatar */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-surface-900 dark:text-surface-100 truncate max-w-[180px]">
                      {lead.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="py-3.5 px-5 text-surface-600 dark:text-surface-400 truncate max-w-[200px]">
                  {lead.email}
                </td>

                {/* Status */}
                <td className="py-3.5 px-5">
                  <StatusBadge status={lead.status} />
                </td>

                {/* Source */}
                <td className="py-3.5 px-5">
                  <SourceBadge source={lead.source} />
                </td>

                {/* Date */}
                <td className="py-3.5 px-5 text-surface-500 dark:text-surface-400 whitespace-nowrap">
                  {formatDate(lead.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); onView(lead); }}
                      className="btn-icon hover:text-brand-600 dark:hover:text-brand-400"
                      aria-label={`View ${lead.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(lead); }}
                          className="btn-icon hover:text-brand-600 dark:hover:text-brand-400"
                          aria-label={`Edit ${lead.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(lead); }}
                          className="btn-icon hover:text-red-600 dark:hover:text-red-400"
                          aria-label={`Delete ${lead.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
