import { APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core';
import {
  Module,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';

import { PrismaFilter } from '@/common';
import { LoggingModule } from '@/logging';
import { AuthModule } from '@/auth';
import { FormsModule } from '@/forms';
import { EventsModule } from '@/events';

@Module({
  imports: [LoggingModule, AuthModule, FormsModule, EventsModule],
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
      useClass: PrismaFilter,
    },
  ],
})
export class AppModule {}

export default AppModule;
