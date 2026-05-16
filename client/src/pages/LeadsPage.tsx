import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import { useLeads } from '../hooks/useLeads';
import { useAuthStore } from '../store/authStore';
import { LeadFilters, Lead } from '../types/lead.types';
import { LeadsTable } from '../components/leads/LeadsTable';
import { LeadFiltersBar } from '../components/leads/LeadFiltersBar';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadDetail } from '../components/leads/LeadDetail';
import { Pagination } from '../components/ui/Pagination';
import { SlideOver } from '../components/ui/SlideOver';
import { Modal } from '../components/ui/Modal';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { exportLeadsCsv } from '../utils/exportCsv';
import { Plus, Download, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const LeadsPage = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';

  // Filters
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, limit: 10, sort: 'latest' });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const queryFilters = { ...filters, search: debouncedSearch };

  // Data
  const { data, isLoading, isError } = useLeads(queryFilters);

  // Detail view state
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  // Create/Edit slide-over state
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) => api.post('/leads', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      setFormOpen(false);
      toast.success('Lead created successfully');
    },
    onError: () => toast.error('Failed to create lead'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Record<string, unknown> }) =>
      api.put(`/leads/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      setFormOpen(false);
      setEditingLead(null);
      toast.success('Lead updated successfully');
    },
    onError: () => toast.error('Failed to update lead'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      setDeleteTarget(null);
      toast.success('Lead deleted successfully');
    },
    onError: () => toast.error('Failed to delete lead'),
  });

  const updateFilter = (patch: Partial<LeadFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));

  const handleView = (lead: Lead) => setViewingLead(lead);

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingLead(null);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    if (editingLead) {
      await updateMutation.mutateAsync({ id: editingLead._id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const handleExport = async () => {
    try {
      await exportLeadsCsv(queryFilters);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-5 animate-fade-in">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Leads</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
              {data?.pagination?.total ?? 0} total leads
              {!isAdmin && <span className="ml-2 text-xs text-surface-400">(Read-only access)</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="export-csv-btn"
              onClick={handleExport}
              className="btn-secondary"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            {isAdmin && (
              <button
                id="create-lead-btn"
                onClick={handleCreate}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                Add Lead
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <LeadFiltersBar
          filters={filters}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onFilterChange={updateFilter}
        />

        {/* Table */}
        <LeadsTable
          leads={data?.data}
          isLoading={isLoading}
          isError={isError}
          isAdmin={isAdmin ?? false}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
        />

        {/* Pagination */}
        {data?.pagination && (
          <Pagination
            meta={data.pagination}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        )}

        {/* Lead Detail Slide-over (all users) */}
        <LeadDetail
          lead={viewingLead}
          isOpen={!!viewingLead}
          onClose={() => setViewingLead(null)}
        />

        {/* Create/Edit Slide-over (admin only) */}
        <SlideOver
          isOpen={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingLead(null);
          }}
          title={editingLead ? 'Edit Lead' : 'Create New Lead'}
        >
          <LeadForm
            key={editingLead?._id ?? 'new'}
            defaultValues={
              editingLead
                ? {
                    name: editingLead.name,
                    email: editingLead.email,
                    status: editingLead.status,
                    source: editingLead.source,
                    notes: editingLead.notes,
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            submitLabel={editingLead ? 'Update Lead' : 'Create Lead'}
          />
        </SlideOver>

        {/* Delete confirmation modal */}
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Lead"
          size="sm"
        >
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-surface-700 dark:text-surface-300 mb-1">
              Are you sure you want to delete
            </p>
            <p className="font-semibold text-surface-900 dark:text-surface-100 mb-6">
              {deleteTarget?.name}?
            </p>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
                disabled={deleteMutation.isPending}
                className="btn-danger"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};
