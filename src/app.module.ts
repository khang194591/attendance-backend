import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HeaderResolver, I18nModule } from 'nestjs-i18n'
import { PrismaModule } from './common/prisma/prisma.module'
import { AttendanceModule } from './modules/attendance/attendance.module'
import { AuthModule } from './modules/auth/auth.module'
import { PublicModule } from './modules/public/public.module'
import { RoleModule } from './modules/setting/role/role.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: { path: './dist/i18n/', watch: true },
      resolvers: [new HeaderResolver(['x-custom-lang'])],
      typesOutputPath: './src/i18n.generated.ts',
    }),
    // PrismaModule,
    // PublicModule,
    // AuthModule,
    // UserModule,
    // RoleModule,
    // AttendanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
