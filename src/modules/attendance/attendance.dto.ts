import { DATE_FORMAT } from '@/common/constants'
import { BaseQueryParamsDto } from '@/common/interfaces'
import { ApiProperty } from '@nestjs/swagger'
import dayjs from 'dayjs'

export class AttendanceDto {
  date: string
  checkIn: string
  checkOut: string
  userId: number
}

export class AttendanceResponseDto extends AttendanceDto {}

export class AttendanceQueryParamsDto extends BaseQueryParamsDto {
  @ApiProperty({
    description: 'Thời gian đầu',
    example: dayjs().startOf('month').format(DATE_FORMAT),
  })
  startDate: string
  @ApiProperty({
    description: 'Thời gian cuối',
    example: dayjs().endOf('month').format(DATE_FORMAT),
  })
  endDate: string
}
