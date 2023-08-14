import { PaginatedDto } from '@/common/interfaces'
import { PrismaService } from '@/common/prisma/prisma.service'
import { parseQueryParams, parseUser } from '@/common/utils'
import { Injectable, Logger } from '@nestjs/common'
import { User } from '@prisma/client'
import { FilterBy, SortBy, Unique, filterByKeys, searchByKeys } from './user.constants'
import { UserResponseDto, UserQueryParamsDto, UserDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UserService.name)
  private readonly repository = this.prisma.user

  async create(data: UserDto) {
    try {
      return parseUser(await this.repository.create({ data }))
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async find(queryParams: UserQueryParamsDto): Promise<PaginatedDto<UserResponseDto>> {
    try {
      const {
        orderBy,
        where: tWhere,
        take,
        skip,
      } = parseQueryParams<SortBy, FilterBy>(queryParams, searchByKeys, filterByKeys)
      const where = { ...tWhere, id: { not: 1 } }
      const total = await this.repository.count({ where })
      const totalPage = Math.ceil(total / take)
      const items = await this.repository.findMany({
        orderBy,
        where: {
          ...where,
          name: {
            search: queryParams.name,
          },
        },
        take,
        skip,
        include: { role: { select: { name: true } } },
      })
      return { items: items.map((user) => parseUser(user)).filter((n) => n), total, totalPage }
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async findByUniqueKey(key: Unique, value: string) {
    try {
      let where = {}
      if (key === 'id') {
        where = { id: parseInt(value) }
      } else {
        where = { [key]: value }
      }
      const item = await this.repository.findUniqueOrThrow({
        where,
        include: {
          role: true,
        },
      })
      return item
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async update(id: number, data: UserDto) {
    try {
      return parseUser(await this.repository.update({ where: { id }, data }))
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async remove(id: number) {
    try {
      return await this.repository.delete({ where: { id } })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async createBulk(data: UserDto[]) {
    try {
      return await this.repository.createMany({
        data,
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
