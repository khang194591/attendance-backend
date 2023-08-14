import { RequiredPermissions, UserId } from '@/common/decorators'
import { PermissionsGuard } from '@/common/guards'
import { Action, Resource } from '@/common/interfaces'
import { YupValidationPipe } from '@/common/pipes'
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserResponseDto, UserQueryParamsDto, UserDto } from './user.dto'
import { querySchema, userSchema } from './user.schema'
import { UserService } from './user.service'
import { parseUser } from '@/common/utils'

@Controller('user')
@UseGuards(PermissionsGuard)
@ApiTags('Quản lý người dùng')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @RequiredPermissions(`${Resource.user}#${Action.create}`)
  @ApiResponse({ status: 201, description: 'Thêm người dùng thành công' })
  @ApiResponse({ status: 409, description: 'Dữ liệu bị trùng lặp(email, phone, citizenId)' })
  @ApiOperation({ summary: 'Thêm người dùng mới' })
  create(@Body(new YupValidationPipe(userSchema)) body: UserDto) {
    try {
      return this.userService.create(body)
    } catch (error) {
      throw error
    }
  }

  @Get()
  @RequiredPermissions(`${Resource.user}#${Action.read}`)
  @ApiResponse({ status: 200, description: 'Lấy danh sách người dùng thành công' })
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  findAll(@Query(new YupValidationPipe(querySchema)) queryParams: UserQueryParamsDto) {
    try {
      return this.userService.find(queryParams)
    } catch (error) {
      throw error
    }
  }

  @Get(':id')
  @RequiredPermissions(`${Resource.user}#${Action.read}`)
  @ApiResponse({ status: 200, description: 'Tìm thấy người dùng' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @ApiOperation({ summary: 'Tìm kiếm người dùng theo ID' })
  async findOne(@Param('id', ParseIntPipe) id: string) {
    try {
      return parseUser(await this.userService.findByUniqueKey('id', id))
    } catch (error) {
      throw error
    }
  }

  @Put(':id')
  @RequiredPermissions(`${Resource.user}#${Action.update}`)
  @ApiResponse({ status: 200, description: 'Cập nhật người dùng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @ApiResponse({ status: 409, description: 'Dữ liệu bị trùng lặp(email, phone, citizenId)' })
  @ApiOperation({ summary: 'Cập nhật thông tin một người dùng' })
  update(@Param('id', ParseIntPipe) id: string, @Body(new YupValidationPipe(userSchema)) data: UserResponseDto) {
    try {
      return this.userService.update(+id, data)
    } catch (error) {
      throw error
    }
  }

  @Delete(':id')
  @RequiredPermissions(`${Resource.user}#${Action.delete}`)
  @ApiResponse({ status: 200, description: 'Xóa người dùng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @ApiOperation({ summary: 'Xóa một người dùng' })
  remove(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.userService.remove(+id)
    } catch (error) {
      throw error
    }
  }

  @Post('bulk')
  dashboard(@Body() data: any) {
    try {
      return this.userService.createBulk(data)
    } catch (error) {
      throw error
    }
  }
}
