import { Body, Controller, Delete, HttpStatus, Post, Res, UnauthorizedException } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { SignInDto, SignUpDto } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
@ApiTags('Đăng nhập')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Sai email hoặc mật khẩu' })
  @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
  async signIn(@Body() body: SignInDto, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(body)

      if (result) {
        res.cookie('token', result.token, {
          secure: true,
          httpOnly: true,
          maxAge: Number(process.env.COOKIE_AGE) * 1000,
        })
        res.cookie('user', JSON.stringify(result.user))
        return res.json(result)
      } else {
        throw new UnauthorizedException()
      }
    } catch (error) {
      throw error
    }
  }

  @Post('sign-up')
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 409, description: 'Email đã được sử dụng' })
  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    try {
      const result = await this.authService.signUp(body)
      res.cookie('token', result.token, {
        secure: true,
        httpOnly: true,
        maxAge: Number(process.env.COOKIE_AGE) * 1000,
      })
      res.cookie('user', JSON.stringify(result.user))
      return res.json(result)
    } catch (error) {
      throw error
    }
  }

  @Delete('sign-out')
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  @ApiOperation({ summary: 'Đăng xuất khỏi hệ thống' })
  async signOut(@Res() res: Response) {
    this.authService.signOut(res)
    return res.status(HttpStatus.OK).json({})
  }
}
