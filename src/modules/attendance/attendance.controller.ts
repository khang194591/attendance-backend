import { RequiredPermissions, UserId, UserPermissions } from '@/common/decorators'
import { PermissionsGuard } from '@/common/guards'
import { Action, Resource } from '@/common/interfaces'
import { YupValidationPipe } from '@/common/pipes'
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AttendanceDto, AttendanceQueryParamsDto } from './attendance.dto'
import { attendanceSchema, querySchema } from './attendance.schema'
import { AttendanceService } from './attendance.service'

@Controller('attendance')
@UseGuards(PermissionsGuard)
@ApiTags('Quản lý chấm công')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @RequiredPermissions(`${Resource.attendance}#${Action.create}`)
  @ApiResponse({ status: 201, description: 'Thêm chấm công thành công' })
  @ApiResponse({ status: 409, description: 'Dữ liệu bị trùng lặp(thời gian không thỏa mãn)' })
  @ApiOperation({ summary: 'Thêm chấm công' })
  create(@Body(new YupValidationPipe(attendanceSchema)) body: AttendanceDto) {
    try {
      return this.attendanceService.create(body)
    } catch (error) {
      throw error
    }
  }

  @Get('time-sheet')
  @ApiOperation({ summary: 'Lấy thông tin bảng chấm công' })
  @RequiredPermissions(`${Resource.attendance}#${Action.read}`, `${Resource.attendance}#${Action.read_personal}`)
  findAllInRange(
    @Query(new YupValidationPipe(querySchema)) queryParams: AttendanceQueryParamsDto,
    @UserPermissions() permissions: string[],
    @UserId() userId: string,
  ) {
    try {
      if (permissions?.includes(`${Resource.attendance}#${Action.read}`)) {
        return this.attendanceService.findAllInRange(queryParams)
      } else {
        return this.attendanceService.findAllInRange(queryParams, +userId)
      }
    } catch (error) {
      throw error
    }
  }

  @Get('day')
  findDayAttendances(@Query('userId', ParseIntPipe) userId: number, @Query('date') date: string) {
    try {
      return this.attendanceService.findDayAttendances(userId, date)
    } catch (error) {
      throw error
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.attendanceService.findByUserId(+id)
    } catch (error) {
      throw error
    }
  }

  @Put(':id')
  @RequiredPermissions(`${Resource.user}#${Action.update}`)
  @ApiResponse({ status: 200, description: 'Cập nhật chấm công thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chấm công' })
  @ApiResponse({ status: 409, description: 'Dữ liệu bị trùng lặp(thời gian)' })
  @ApiOperation({ summary: 'Cập nhật thông tin một chấm công' })
  update(@Param('id', ParseIntPipe) id: string, @Body(new YupValidationPipe(attendanceSchema)) data: AttendanceDto) {
    try {
      return this.attendanceService.update(+id, data)
    } catch (error) {
      throw error
    }
  }

  @Delete(':id')
  @RequiredPermissions(`${Resource.attendance}#${Action.delete}`)
  @ApiResponse({ status: 200, description: 'Xóa chấm công thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chấm công' })
  @ApiOperation({ summary: 'Xóa một chấm công' })
  remove(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.attendanceService.remove(+id)
    } catch (error) {
      throw error
    }
  }
}
