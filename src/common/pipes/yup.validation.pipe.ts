import { Injectable, PipeTransform } from '@nestjs/common'
import { AnyObjectSchema } from 'yup'

@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(private schema: AnyObjectSchema) {}

  transform(value: any) {
    return this.schema.validateSync(value, { stripUnknown: true })
  }
}
