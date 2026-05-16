import { Lead, ILead } from '../models/Lead';
import { LeadFilters, PaginationMeta } from '../types/lead.types';
import { FilterQuery } from 'mongoose';

interface PaginatedLeads {
  leads: ILead[];
  pagination: PaginationMeta;
}

export const queryLeads = async (filters: LeadFilters): Promise<PaginatedLeads> => {
  const {
    status,
    source,
    search,
    sort = 'latest',
    page = 1,
    limit = 10,
  } = filters;

  // Build query dynamically — all filters are optional and composable
  const query: FilterQuery<ILead> = {};
  if (status) query.status = status;
  if (source) query.source = source;
  if (search) {
    const regex = new RegExp(search, 'i');
    query.$or = [{ name: regex }, { email: regex }];
  }

  const sortOrder = sort === 'latest' ? -1 : 1;
  const skip = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email'),
    Lead.countDocuments(query),
  ]);

  return {
    leads,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createLead = (data: Partial<ILead>) => Lead.create(data);

export const getLeadById = (id: string) => Lead.findById(id).populate('createdBy', 'name email');

export const updateLead = (id: string, data: Partial<ILead>) =>
  Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteLead = (id: string) => Lead.findByIdAndDelete(id);

export const getLeadStats = async () => {
  const [total, statusCounts, sourceCounts] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]),
  ]);

  return {
    total,
    byStatus: Object.fromEntries(statusCounts.map((s) => [s._id, s.count])),
    bySource: Object.fromEntries(sourceCounts.map((s) => [s._id, s.count])),
  };
};
