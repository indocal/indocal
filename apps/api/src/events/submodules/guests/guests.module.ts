import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import EventsGuestsController from './guests.controller';

@Module({
  imports: [AuthModule],
  controllers: [EventsGuestsController],
  providers: [PrismaService],
})
export class EventsGuestsModule {}

export default EventsGuestsModule;
