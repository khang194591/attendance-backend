import { PrismaService } from '@/common/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { AbsenceRequest } from '@prisma/client'

@Injectable()
export class AbsenceService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly repository = this.prisma.absenceRequest

  async create(data) {
    try {
      return await this.repository.create({ data })
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async find() {
    try {
      const items = await this.repository.findMany({
        include: {
          user: true,
        },
      })
      const total = await this.repository.count()
      return { items, total }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async update(id: number, data) {
    try {
      return await this.repository.update({ where: { id }, data })
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async remove(id: number) {
    try {
      return await this.repository.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
}
