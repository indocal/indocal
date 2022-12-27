import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';

import LoggingService from './logging.service';
import LoggingInterceptor from './logging.interceptor';

@Module({
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
