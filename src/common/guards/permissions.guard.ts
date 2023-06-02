import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { Role, User } from '@prisma/client'
import { Request, Response } from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { difference, intersection } from 'lodash'
import { EnvKey } from '../constants'
import { REQUIRED_PERMISSIONS_KEY } from '../decorators'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const requirePermissions = this.reflector.getAllAndOverride<string[]>(REQUIRED_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    // Nếu không yêu cầu quyền, cho phép
    if (!requirePermissions) {
      return true
    }
    const request = context.switchToHttp().getRequest() as Request
    const response = context.switchToHttp().getResponse() as Response
    const token = request.cookies['token']
    try {
      const payload = jwt.verify(token, this.configService.get(EnvKey.TOKEN_SECRET)) as User & {
        role: Role
      }
      // Super admin bỏ qua mọi kiểm tra quyền
      if (payload.email === process.env.ADMIN_EMAIL) {
        return true
      }

      const permissions = payload.role.permissions
      const user = await this.prismaService.user.findUnique({ where: { id: payload.id }, include: { role: true } })

      // Nếu có thay đổi về quyền, yêu dùng người dùng đăng nhập lại
      if (difference(permissions, user.role.permissions).length !== 0) {
        response.cookie('token', '', {
          secure: true,
          httpOnly: true,
          maxAge: Number(process.env.COOKIE_AGE) * 1000,
        })
        response.cookie('user', '')
        throw new UnauthorizedException('Permissions changed. Please login again!')
      }

      // Nếu thỏa mãn một trong những quyền yêu cầu, cho phép
      request.user = payload
      return intersection(requirePermissions, permissions).length > 0
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message)
      } else {
        throw error
      }
    }
  }
}
