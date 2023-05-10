import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import {
  ServicesRequestsCRUDController,
  ServicesRequestsActionsController,
} from './controllers';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [
    ServicesRequestsCRUDController,
    ServicesRequestsActionsController,
  ],
  providers: [PrismaService],
})
export class ServicesRequestsModule {}

export default ServicesRequestsModule;
