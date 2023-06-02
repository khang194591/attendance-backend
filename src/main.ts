import './common/plugins/dayjs'

import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { EnvKey } from './common/constants'
import { GlobalExceptionFilter } from './common/errors/errors-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService: ConfigService = app.get(ConfigService)

  // Khởi tạo cors
  app.enableCors({
    credentials: true,
    origin: configService.get(EnvKey.CLIENT_BASE_URL),
  })

  // Cho phép sử dụng cookies
  app.use(cookieParser())

  app.setGlobalPrefix(configService.get(EnvKey.BASE_PATH))

  app.useGlobalFilters(new GlobalExceptionFilter())

  // Khởi tạo swagger document
  const swaggerConfig = new DocumentBuilder().setTitle('BASE API').setDescription('Tài liệu API cho dự án Base').build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup(configService.get(EnvKey.DOCS_PATH), app, swaggerDocument, {
    swaggerOptions: { withCredentials: true },
  })

  await app.listen(configService.get(EnvKey.PORT))
}
bootstrap()
