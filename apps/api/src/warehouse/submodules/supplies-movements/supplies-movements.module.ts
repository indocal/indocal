import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import SuppliesMovementsController from './supplies-movements.controller';

@Module({
  imports: [AuthModule],
  controllers: [SuppliesMovementsController],
  providers: [PrismaService],
})
export class SuppliesMovementsModule {}

export default SuppliesMovementsModule;
