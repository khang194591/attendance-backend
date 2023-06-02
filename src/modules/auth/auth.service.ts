import { EnvKey } from '@/common/constants'
import { PrismaService } from '@/common/prisma/prisma.service'
import { signJWT } from '@/common/utils'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { compareSync } from 'bcrypt'
import { Response } from 'express'
import { UserService } from '../user/user.service'
import { SignInDto, SignUpDto } from './auth.dto'
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async signIn(data: SignInDto) {
    try {
      if (
        data.email === this.configService.get(EnvKey.ADMIN_EMAIL) &&
        data.password === this.configService.get(EnvKey.ADMIN_PASSWORD)
      ) {
        const user = { email: data.email, name: 'Admin', super: true }
        const token = signJWT(user)
        return { user, token }
      }

      const user = await this.userService.findByUniqueKey('email', data.email)

      if (user && user.password && compareSync(data.password, user.password)) {
        delete user.password
        const token = signJWT(user)
        return { token, user }
      } else {
        throw new UnauthorizedException('Wrong Credentials')
      }
    } catch (error) {
      throw error
    }
  }

  async signUp(data: SignUpDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...data,
          roleId: 2,
        },
      })
      delete newUser.password
      const token = signJWT(newUser)
      return { token, user: newUser }
    } catch (error) {
      throw error
    }
  }

  async signOut(res: Response) {
    res.cookie('token', '', {
      secure: true,
      httpOnly: true,
      maxAge: Number(this.configService.get(EnvKey.COOKIE_AGE)) * 1000,
    })
    res.cookie('user', '')
    return true
  }
}
