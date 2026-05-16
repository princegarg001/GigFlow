import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { LeadFilters, LeadsApiResponse, StatsApiResponse } from '../types/lead.types';

export const useLeads = (filters: LeadFilters) =>
  useQuery<LeadsApiResponse>({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.set(k, String(v));
      });
      const { data } = await api.get<LeadsApiResponse>(`/leads?${params}`);
      return data;
    },
  });

export const useLeadStats = () =>
  useQuery<StatsApiResponse>({
    queryKey: ['lead-stats'],
    queryFn: async () => {
      const { data } = await api.get<StatsApiResponse>('/leads/stats');
      return data;
    },
  });
