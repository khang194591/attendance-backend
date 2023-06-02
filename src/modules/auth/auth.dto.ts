import { ApiProperty } from '@nestjs/swagger'
import { UserResponseDto } from '../user/user.dto'

export class SignInDto {
  @ApiProperty({
    description: 'Email',
    example: 'khang194591@gmail.com',
  })
  email: string
  @ApiProperty({
    description: 'Mật khẩu',
    example: '@sang.123',
  })
  password: string
}

export class SignUpDto extends SignInDto {
  @ApiProperty({
    description: 'Họ tên',
    example: 'Trịnh Đức Khang',
  })
  name: string
}
