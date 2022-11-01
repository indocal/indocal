import { APP_INTERCEPTOR, APP_GUARD, APP_PIPE, APP_FILTER } from '@nestjs/core';
import {
  Module,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';

import { PrismaFilter } from '@/common';
import { AuthModule, JwtAuthGuard } from '@/auth';
import { FormsModule } from '@/forms';
import { EventsModule } from '@/events';

@Module({
  imports: [AuthModule, FormsModule, EventsModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
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
