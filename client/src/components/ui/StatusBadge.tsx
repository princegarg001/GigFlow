import { LeadStatus } from '../../types/lead.types';

const statusConfig: Record<LeadStatus, { class: string; dot: string }> = {
  new:       { class: 'badge-new',       dot: 'bg-blue-500' },
  contacted: { class: 'badge-contacted', dot: 'bg-amber-500' },
  qualified: { class: 'badge-qualified', dot: 'bg-emerald-500' },
  lost:      { class: 'badge-lost',      dot: 'bg-red-500' },
};

interface Props {
  status: LeadStatus;
}

export const StatusBadge = ({ status }: Props) => {
  const config = statusConfig[status];
  return (
    <span className={config.class}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};
