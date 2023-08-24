import {
  APP_INTERCEPTOR,
  APP_PIPE,
  APP_FILTER,
  HttpAdapterHost,
} from '@nestjs/core';
import {
  Module,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule, PrismaClientExceptionFilter } from 'nestjs-prisma';

import { LoggingModule } from '@/logging';
import { AuthModule } from '@/auth';
import { FormsModule } from '@/forms';
import { ServicesModule } from '@/services';
import { UploadsModule } from '@/uploads';
import { CommentsModule } from '@/comments';
import { WarehouseModule } from '@/warehouse';

@Module({
  imports: [
    LoggingModule,
    AuthModule,
    FormsModule,
    ServicesModule,
    UploadsModule,
    CommentsModule,
    WarehouseModule,
    PrismaModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    {
      provide: APP_FILTER,
      inject: [HttpAdapterHost],
      useFactory: ({ httpAdapter }: HttpAdapterHost) =>
        new PrismaClientExceptionFilter(httpAdapter),
    },
  ],
})
export class AppModule {}

export default AppModule;
