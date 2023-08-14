import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AbsenceService } from './absence.service'

@Controller('absence')
@ApiTags('Absence')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Post()
  create(@Body() body) {
    return this.absenceService.create(body)
  }

  @Get()
  findAll() {
    return this.absenceService.find()
  }

  @Put(':id')
  async findOne(@Param('id', ParseIntPipe) id: string, @Body() data) {
    try {
      return await this.absenceService.update(+id, data)
    } catch (error) {
      throw error
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.absenceService.remove(+id)
    } catch (error) {
      throw error
    }
  }
}
