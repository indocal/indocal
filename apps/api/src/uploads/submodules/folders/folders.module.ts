import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import FoldersController from './folders.controller';

@Module({
  imports: [AuthModule],
  controllers: [FoldersController],
  providers: [PrismaService],
})
export class FoldersModule {}

export default FoldersModule;
