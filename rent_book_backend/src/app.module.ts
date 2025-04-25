import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { RolesGuard } from './roles/roles.guard';
import { RentBookModule } from './rent_book/rent_book.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, PrismaModule, RentBookModule, UserModule,ScheduleModule.forRoot()],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class AppModule {}