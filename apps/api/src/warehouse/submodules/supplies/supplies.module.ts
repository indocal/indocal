import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import SuppliesController from './supplies.controller';

@Module({
  imports: [AuthModule],
  controllers: [SuppliesController],
  providers: [PrismaService],
})
export class SuppliesModule {}

export default SuppliesModule;
