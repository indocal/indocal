import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import EventsController from './events.controller';

import { EventsGuestsModule } from './submodules';

@Module({
  imports: [AuthModule, EventsGuestsModule],
  controllers: [EventsController],
  providers: [PrismaService],
})
export class EventsModule {}

export default EventsModule;
