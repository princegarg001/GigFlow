import { ILead } from '../models/Lead';

const escapeCell = (value: string): string => `"${value.replace(/"/g, '""')}"`;

export const generateCsv = (leads: ILead[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];

  const rows = leads.map((l) => [
    escapeCell(l.name),
    escapeCell(l.email),
    l.status,
    l.source,
    escapeCell(l.notes ?? ''),
    new Date(l.createdAt).toISOString(),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};
