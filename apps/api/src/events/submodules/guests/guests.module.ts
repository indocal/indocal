import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import EventsGuestsController from './guests.controller';
import EventsGuestsService from './guests.service';

@Module({
  imports: [AuthModule],
  controllers: [EventsGuestsController],
  providers: [PrismaService, EventsGuestsService],
  exports: [EventsGuestsService],
})
export class EventsGuestsModule {}

export default EventsGuestsModule;
