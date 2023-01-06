import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import LoggingController from './logging.controller';
import LoggingService from './logging.service';
import LoggingInterceptor from './logging.interceptor';

@Module({
  imports: [AuthModule],
  controllers: [LoggingController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    PrismaService,
    LoggingService,
  ],
  exports: [LoggingService],
})
export class LoggingModule {}

export default LoggingModule;
