import { Lead } from '../../types/lead.types';
import { StatusBadge } from '../ui/StatusBadge';
import { SourceBadge } from '../ui/SourceBadge';
import { SlideOver } from '../ui/SlideOver';
import { formatDateTime, timeAgo } from '../../utils/formatDate';
import { Mail, User, Calendar, Clock, FileText, UserCircle } from 'lucide-react';

interface Props {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadDetail = ({ lead, isOpen, onClose }: Props) => {
  if (!lead) return null;

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title="Lead Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-surface-200 dark:border-surface-800">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 truncate">
              {lead.name}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
              {lead.email}
            </p>
          </div>
        </div>

        {/* Status & Source */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-2">
              Status
            </p>
            <StatusBadge status={lead.status} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-2">
              Source
            </p>
            <SourceBadge source={lead.source} />
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-4">
          <DetailRow
            icon={Mail}
            label="Email"
            value={lead.email}
          />
          <DetailRow
            icon={User}
            label="Full Name"
            value={lead.name}
          />
          <DetailRow
            icon={Calendar}
            label="Created"
            value={formatDateTime(lead.createdAt)}
          />
          <DetailRow
            icon={Clock}
            label="Last Updated"
            value={timeAgo(lead.updatedAt)}
          />
          <DetailRow
            icon={UserCircle}
            label="Created By"
            value={lead.createdBy?.name ?? 'Unknown'}
          />
        </div>

        {/* Notes */}
        {lead.notes && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-surface-400" />
              <p className="text-xs font-medium uppercase tracking-wider text-surface-400 dark:text-surface-500">
                Notes
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
              <p className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap leading-relaxed">
                {lead.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};

/* ── Internal row component ────────────────── */
interface DetailRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const DetailRow = ({ icon: Icon, label, value }: DetailRowProps) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-surface-500 dark:text-surface-400" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-surface-400 dark:text-surface-500">{label}</p>
      <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">{value}</p>
    </div>
  </div>
);
