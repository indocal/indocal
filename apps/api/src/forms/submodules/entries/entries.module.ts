import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import FormsEntriesController from './entries.controller';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [FormsEntriesController],
  providers: [PrismaService],
})
export class FormsEntriesModule {}

export default FormsEntriesModule;
