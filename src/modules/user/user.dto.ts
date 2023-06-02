import { BaseDto, BaseQueryParamsDto } from '@/common/interfaces'
import { Gender, SortBy, Status } from './user.constants'
import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty({
    description: 'Email',
    example: 'white.walter@gmail.com',
  })
  email: string

  @ApiProperty({
    description: 'Họ tên',
    example: 'Walter White',
  })
  name: string

  @ApiProperty({
    description: 'Link ảnh đại diện',
    example: 'https://upload.wikimedia.org/wikipedia/en/0/03/Walter_White_S5B.png',
  })
  avatarUrl: string

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0987654321',
  })
  phone: string

  @ApiProperty({
    description: 'Ngày sinh',
    example: '1958-09-07',
  })
  birthDay: string

  @ApiProperty({
    description: 'Giới tính',
  })
  gender: Gender

  @ApiProperty({
    description: 'Địa chỉ',
    example: '3828 Piermont Dr NE, Albuquerque, New Mexico',
  })
  address: string

  @ApiProperty({
    description: 'Tỉnh',
  })
  province: string

  @ApiProperty({
    description: 'Huyện',
  })
  district: string

  @ApiProperty({
    description: 'Xã',
  })
  ward: string

  @ApiProperty({
    description: 'Ngân hàng',
    example: 'VietinBank',
  })
  bank: string

  @ApiProperty({
    description: 'Tài khoản ngân hàng',
    example: '123456789',
  })
  bankAccount: string

  @ApiProperty({
    description: 'Số CMND/CCCD',
    example: '1234567890',
  })
  citizenId: string

  @ApiProperty({
    description: 'Trạng thái (hoạt động/chờ xử lý/không hoạt động)',
  })
  status: Status

  @ApiProperty({
    description: 'Mã vai trò',
    example: 2,
  })
  roleId: number
}

export class UserResponseDto extends UserDto implements BaseDto {
  id: number
  createdAt: Date
  updatedAt: Date
}

export class UserQueryParamsDto extends BaseQueryParamsDto<SortBy> {
  name?: string
  email?: string
  phone?: string
  province?: string[]
  district?: string[]
  ward?: string[]
  gender?: Gender[]
  status?: Status[]
  roleId?: number[]
}
