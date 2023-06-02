import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PublicService } from './public.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'

@Controller('public')
@ApiTags('Public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('user')
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  @ApiOperation({ summary: 'Lấy danh sách ID và Họ tên của người dùng' })
  getUsers() {
    try {
      return this.publicService.getUsers()
    } catch (error) {
      throw error
    }
  }

  @Get('role')
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  @ApiOperation({ summary: 'Lấy danh sách ID và tên của vai trò' })
  getRoles() {
    try {
      return this.publicService.getRoles()
    } catch (error) {
      throw error
    }
  }

  @Get('bank')
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  @ApiOperation({ summary: 'Lấy danh sách tên và mã ngân hàng' })
  getBanks() {
    try {
      return this.publicService.getBanks()
    } catch (error) {
      throw error
    }
  }

  @Get('province')
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  @ApiOperation({ summary: 'Lấy danh sách tỉnh' })
  getProvinces() {
    try {
      return this.publicService.getProvinces()
    } catch (error) {
      throw error
    }
  }

  @Get('province/:province')
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  @ApiOperation({ summary: 'Lấy danh sách huyện theo tỉnh' })
  getDistricts(@Param('province') codename: string) {
    try {
      return this.publicService.getDistricts(codename)
    } catch (error) {
      throw error
    }
  }
  @Get('province/:province/:district')
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  @ApiOperation({ summary: 'Lấy danh sách xã theo tỉnh và huyện' })
  getWards(@Param('province') provinceCodename: string, @Param('district') districtCodename: string) {
    try {
      return this.publicService.getWards(provinceCodename, districtCodename)
    } catch (error) {
      throw error
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return this.publicService.uploadFile(file)
    } catch (error) {
      throw error
    }
  }

  @Get('file/:id')
  async getImageById(@Param('id') id: string, @Res() res: Response) {
    const file = await this.publicService.getImageById(+id)
    const buffer = Buffer.from(file.buffer, 'base64')
    res.contentType(file.mimetype)
    res.send(buffer)
  }
}
