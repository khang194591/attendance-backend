import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Attendance, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { groupBy, identity, pickBy } from 'lodash'
import { AttendanceDto, AttendanceQueryParamsDto } from './attendance.dto'
import { PrismaService } from '@/common/prisma/prisma.service'
import {
  AFTERNOON_END,
  AFTERNOON_START,
  DATE_FORMAT,
  MORNING_END,
  MORNING_START,
  TIME_FORMAT,
} from '@/common/constants'
import { parseQueryParams } from '@/common/utils'
import { FilterBy, SortBy, filterByKeys, searchByKeys } from '../user/user.constants'

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: AttendanceDto) {
    try {
      const isValid = await this.validAttendance(data)
      if (isValid) {
        const newItem = await this.prisma.attendance.create({ data })
        return newItem
      } else {
        throw new BadRequestException('Existed attendance in that range')
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.meta.cause)
      } else {
        throw error
      }
    }
  }

  async findAllInRange(queryParams: AttendanceQueryParamsDto, userId?: number) {
    try {
      const {
        orderBy,
        where: w,
        take,
        skip,
      } = parseQueryParams<SortBy, FilterBy>(queryParams, searchByKeys, filterByKeys)
      const where = userId ? { ...w, id: userId } : { ...w, id: { not: 1 } }
      const total = await this.prisma.user.count({ where })
      const totalPage = Math.ceil(total / take)
      const userAttendances = await this.prisma.user.findMany({
        orderBy,
        where,
        take,
        skip,
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          attendances: { where: { date: { gte: queryParams.startDate, lte: queryParams.endDate } } },
        },
      })
      const items = userAttendances.map((user) => {
        let late = 0
        let full = 0
        let absence =
          dayjs.min(dayjs(), dayjs(queryParams.endDate)).diff(dayjs(queryParams.startDate, DATE_FORMAT), 'day') + 1
        let weekend = 0
        for (let i = 0; i < absence; i++) {
          if (dayjs(queryParams.startDate, DATE_FORMAT).add(i, 'day').get('day') % 6 === 0) {
            weekend++
          }
        }
        const attendances = Object.entries(groupBy(user.attendances, 'date')).map(([dateString, items]) => {
          const total = this.getTotalTime(items)
          const date = dayjs(dateString).diff(queryParams.startDate, 'day')
          return { date, total }
        })
        attendances.forEach((attendance) => (attendance.total >= 8 ? full++ : late++))
        absence = absence - late - full - weekend
        return {
          ...user,
          late,
          full,
          absence,
          attendances,
        }
      })
      return { items, total, totalPage }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.meta.cause)
      } else {
        throw error
      }
    }
  }

  async findDayAttendances(userId: number, date: string) {
    try {
      const items = await this.prisma.attendance.findMany({
        where: { userId, date },
        select: {
          id: true,
          checkIn: true,
          checkOut: true,
          date: true,
          userId: true,
          user: { select: { name: true } },
        },
        orderBy: {
          checkIn: 'asc',
        },
      })
      return items
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.meta.cause)
      } else {
        throw error
      }
    }
  }

  async findByUserId(userId: number) {
    try {
      const item = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          attendances: true,
        },
      })
      if (!item) {
        throw new NotFoundException()
      }
      return item
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.meta.cause)
      } else {
        throw error
      }
    }
  }

  async update(id: number, data: AttendanceDto) {
    try {
      const isValid = await this.validAttendance(data, id)
      if (isValid) {
        const updatedItem = await this.prisma.attendance.update({
          where: { id },
          data: data,
        })
        return updatedItem
      } else {
        throw new BadRequestException('Existed attendance in that range')
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.meta.cause)
      } else {
        throw error
      }
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.attendance.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }

  getTotalTime(items?: Attendance[]) {
    const morningStart = dayjs(MORNING_START, TIME_FORMAT)
    const morningEnd = dayjs(MORNING_END, TIME_FORMAT)
    const afternoonStart = dayjs(AFTERNOON_START, TIME_FORMAT)
    const afternoonEnd = dayjs(AFTERNOON_END, TIME_FORMAT)
    const totalTime = items?.reduce((accumulator, currentValue) => {
      const _checkIn = dayjs(currentValue.checkIn, TIME_FORMAT)
      const _checkOut = dayjs(currentValue.checkOut, TIME_FORMAT)
      const checkIn = morningStart.isAfter(_checkIn)
        ? morningStart
        : morningEnd.isBefore(_checkIn) && afternoonStart.isAfter(_checkIn)
        ? afternoonStart
        : _checkIn
      const checkOut = afternoonEnd.isBefore(_checkOut)
        ? afternoonEnd
        : morningEnd.isBefore(_checkOut) && afternoonStart.isAfter(_checkOut)
        ? morningEnd
        : _checkOut
      const haveBreak = dayjs(_checkIn).isBefore(morningEnd) && dayjs(_checkOut).isAfter(afternoonStart) ? 1 : 0
      return accumulator + dayjs(checkOut).diff(dayjs(checkIn)) - dayjs.duration(haveBreak, 'hour').asMilliseconds()
    }, 0)
    if (totalTime) {
      return dayjs.duration(totalTime).asHours()
    }
  }

  // Tham số [id] giúp bỏ qua kiểm tra item đang muốn update
  async validAttendance(data: AttendanceDto, id?: number) {
    const items = await this.prisma.attendance.findMany({
      where: {
        userId: data.userId,
        date: data.date,
      },
    })
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.id === id) continue
      if (
        (item.checkIn < data.checkIn && item.checkOut < data.checkIn) ||
        (item.checkIn > data.checkOut && item.checkIn > data.checkOut)
      ) {
      } else {
        return false
      }
    }
    return true
  }
}
