import { PrismaService } from '@/common/prisma/prisma.service'
import { ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { RoleDto, RoleResponseDto } from './role.dto'
import { PaginatedDto } from '@/common/interfaces'

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(RoleService.name)
  private readonly repository = this.prisma.role

  async create(data: RoleDto) {
    try {
      return await this.repository.create({ data })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async find(): Promise<PaginatedDto<RoleResponseDto>> {
    try {
      const where = { id: { not: 1 } }
      const total = await this.repository.count({ where })
      const items = await this.repository.findMany({ where })
      return { items, total }
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async update(id: number, data: RoleDto) {
    try {
      if (id === 1) {
        throw new ForbiddenException()
      }
      return await this.repository.update({ where: { id }, data })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async remove(id: number) {
    try {
      if (id === 1) {
        throw new ForbiddenException()
      }
      return await this.repository.delete({ where: { id } })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
