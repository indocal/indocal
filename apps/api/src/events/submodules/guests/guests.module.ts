import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import EventsGuestsController from './guests.controller';

@Module({
  imports: [AuthModule],
  controllers: [EventsGuestsController],
  providers: [PrismaService],
})
export class EventsGuestsModule {}

export default EventsGuestsModule;
