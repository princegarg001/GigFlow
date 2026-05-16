import { Request, Response } from 'express';
import * as leadService from '../services/leadService';
import { ApiError } from '../utils/ApiError';
import { generateCsv } from '../utils/csvExport';
import { LeadStatus, LeadSource } from '../models/Lead';

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  const { status, source, search, sort, page, limit } = req.query;

  const result = await leadService.queryLeads({
    status: status as LeadStatus | undefined,
    source: source as LeadSource | undefined,
    search: search as string | undefined,
    sort: sort as 'latest' | 'oldest' | undefined,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });

  res.json({ success: true, data: result.leads, pagination: result.pagination });
};

export const getLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await leadService.getLeadById(req.params.id as string);
  if (!lead) throw new ApiError(404, 'Lead not found');
  res.json({ success: true, data: lead });
};

export const createLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await leadService.createLead({
    ...req.body,
    createdBy: req.user!.userId,
  });
  res.status(201).json({ success: true, data: lead, message: 'Lead created' });
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await leadService.updateLead(req.params.id as string, req.body);
  if (!lead) throw new ApiError(404, 'Lead not found');
  res.json({ success: true, data: lead, message: 'Lead updated' });
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await leadService.deleteLead(req.params.id as string);
  if (!lead) throw new ApiError(404, 'Lead not found');
  res.json({ success: true, message: 'Lead deleted' });
};

export const exportLeads = async (req: Request, res: Response): Promise<void> => {
  const { status, source, search, sort } = req.query;
  const { leads } = await leadService.queryLeads({
    status: status as LeadStatus | undefined,
    source: source as LeadSource | undefined,
    search: search as string | undefined,
    sort: sort as 'latest' | 'oldest' | undefined,
    page: 1,
    limit: 100_000,
  });

  const csv = generateCsv(leads);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
  res.send(csv);
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  const stats = await leadService.getLeadStats();
  res.json({ success: true, data: stats });
};
