import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import {
  FormsEntriesCRUDController,
  FormsEntriesStatsController,
} from './controllers';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [FormsEntriesCRUDController, FormsEntriesStatsController],
  providers: [PrismaService],
})
export class FormsEntriesModule {}

export default FormsEntriesModule;
