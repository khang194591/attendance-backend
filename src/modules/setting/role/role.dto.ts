import { BaseDto } from '@/common/interfaces'

export class RoleDto {
  name: string
  permissions: string[]
}

export class RoleResponseDto extends RoleDto implements BaseDto {
  id: number
  createdAt: Date
  updatedAt: Date
}
