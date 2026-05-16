import { LeadSource } from '../../types/lead.types';
import { Globe, Instagram, Users } from 'lucide-react';

const sourceConfig: Record<LeadSource, { icon: React.ElementType; label: string }> = {
  website:   { icon: Globe,     label: 'Website' },
  instagram: { icon: Instagram, label: 'Instagram' },
  referral:  { icon: Users,     label: 'Referral' },
};

interface Props {
  source: LeadSource;
}

export const SourceBadge = ({ source }: Props) => {
  const config = sourceConfig[source];
  const Icon = config.icon;
  return (
    <span className="badge-source">
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};
