import { number, object, string } from 'yup'

export const baseUniqueKeys = ['id'] as const

export const baseSortByKeys = ['createdAt', 'updatedAt'] as const

export const sortOrderKeys = ['asc', 'desc'] as const

export const DEFAULT_PAGE_SIZE = 5

export const DEFAULT_PAGE_SIZES = [5, 10, 25, 100]

export const baseQuerySchema = object({
  sortBy: string(),
  sortOrder: string().oneOf(sortOrderKeys),
  page: number(),
  take: number(),
})
