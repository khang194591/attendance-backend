import { sortOrderKeys } from '../constants'

export type SortOrder = (typeof sortOrderKeys)[number]

export class BaseQueryParamsDto<S = any> {
  sortBy?: S
  sortOrder?: SortOrder

  page?: number
  take?: number
}

export class PaginatedDto<T> {
  items: T[]
  total: number
  totalPage?: number
}

export class BaseDto {
  id: number

  createdAt: Date
  updatedAt: Date
}
