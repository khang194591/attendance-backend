import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const UserPermissions = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request
  return request.user?.role.permissions
})

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request
  return request.user?.id
})
