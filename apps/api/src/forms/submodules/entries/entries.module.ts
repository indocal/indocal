import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import FormsEntriesController from './entries.controller';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [FormsEntriesController],
  providers: [PrismaService],
})
export class FormsEntriesModule {}

export default FormsEntriesModule;
