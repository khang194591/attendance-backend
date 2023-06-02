import { baseSortByKeys, baseUniqueKeys } from '@/common/constants'

// Những trường unique để tìm kiếm
export const uniqueKeys = ['email', 'phone', ...baseUniqueKeys] as const
export type Unique = (typeof uniqueKeys)[number]

// Những trường có thể sắp xếp
export const sortByKeys = ['name', 'email', ...baseSortByKeys] as const
export type SortBy = (typeof sortByKeys)[number]

// Những trường dùng để tìm kiếm
export const searchByKeys = ['name', 'email', 'phone'] as const
export type SearchBy = (typeof searchByKeys)[number]

// Những trường để lọc theo giá trị chính xác, có thể chọn nhiều quá trị
export const filterByKeys = ['gender', 'status', 'roleId'] as const
export type FilterBy = (typeof filterByKeys)[number]

export enum Status {
  active = 'active',
  pending = 'pending',
  inactive = 'inactive',
}

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other',
}
