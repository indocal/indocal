import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import EventsController from './events.controller';

import { EventsGuestsModule } from './submodules';

@Module({
  imports: [AuthModule, EventsGuestsModule],
  controllers: [EventsController],
  providers: [PrismaService],
})
export class EventsModule {}

export default EventsModule;
