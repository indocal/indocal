import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import FormsEntriesController from './entries.controller';

@Module({
  imports: [AuthModule],
  controllers: [FormsEntriesController],
  providers: [PrismaService],
})
export class FormsEntriesModule {}

export default FormsEntriesModule;
