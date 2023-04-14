import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import ServicesRequestsController from './requests.controller';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [ServicesRequestsController],
  providers: [PrismaService],
})
export class ServicesRequestsModule {}

export default ServicesRequestsModule;
