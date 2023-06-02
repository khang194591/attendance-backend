import { RequiredPermissions } from '@/common/decorators'
import { PermissionsGuard } from '@/common/guards'
import { Action, Resource } from '@/common/interfaces'
import { YupValidationPipe } from '@/common/pipes'
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RoleDto, RoleResponseDto } from './role.dto'
import { roleSchema } from './role.schema'
import { RoleService } from './role.service'

@Controller('setting/role')
@UseGuards(PermissionsGuard)
@ApiTags('Quản lý vai trò')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @RequiredPermissions(`${Resource.role}#${Action.create}`)
  @ApiResponse({ status: 201, description: 'Thêm vai trò thành công' })
  @ApiResponse({ status: 409, description: 'Dữ liệu bị trùng lặp(name)' })
  @ApiOperation({ summary: 'Thêm vai trò mới' })
  create(@Body(new YupValidationPipe(roleSchema)) body: RoleDto) {
    try {
      return this.roleService.create(body)
    } catch (error) {
      throw error
    }
  }

  @Get()
  @RequiredPermissions(`${Resource.role}#${Action.read}`)
  @ApiResponse({ status: 200, description: 'Lấy danh sách vai trò thành công' })
  @ApiOperation({ summary: 'Lấy danh sách vai trò' })
  findAll() {
    try {
      return this.roleService.find()
    } catch (error) {
      throw error
    }
  }

  @Put(':id')
  @RequiredPermissions(`${Resource.role}#${Action.update}`)
  @ApiResponse({ status: 200, description: 'Cập nhật vai trò thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò' })
  @ApiResponse({ status: 409, description: 'Dữ liệu bị trùng lặp(name)' })
  @ApiOperation({ summary: 'Cập nhật thông tin một vai trò' })
  update(@Param('id', ParseIntPipe) id: string, @Body(new YupValidationPipe(roleSchema)) data: RoleResponseDto) {
    try {
      return this.roleService.update(+id, data)
    } catch (error) {
      throw error
    }
  }

  @Delete(':id')
  @RequiredPermissions(`${Resource.role}#${Action.delete}`)
  @ApiResponse({ status: 200, description: 'Xóa vai trò thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò' })
  @ApiOperation({ summary: 'Xóa một vai trò' })
  remove(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.roleService.remove(+id)
    } catch (error) {
      throw error
    }
  }
}
