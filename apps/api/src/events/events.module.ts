import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import EventsController from './events.controller';
import EventsService from './events.service';

import { EventsGuestsModule } from './submodules';

@Module({
  imports: [AuthModule, EventsGuestsModule],
  controllers: [EventsController],
  providers: [PrismaService, EventsService],
  exports: [EventsService],
})
export class EventsModule {}

export default EventsModule;
