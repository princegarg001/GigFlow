import api from '../api/axiosInstance';
import { LeadFilters } from '../types/lead.types';

export const exportLeadsCsv = async (filters: LeadFilters): Promise<void> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && k !== 'page' && k !== 'limit') {
      params.set(k, String(v));
    }
  });

  const response = await api.get(`/leads/export?${params}`, {
    responseType: 'blob',
  });

  const url = URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
