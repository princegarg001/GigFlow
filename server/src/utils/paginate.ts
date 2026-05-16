export interface PaginateOptions {
  page: number;
  limit: number;
}

export const getPagination = ({ page, limit }: PaginateOptions) => ({
  skip: (page - 1) * limit,
  limit,
});

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});
