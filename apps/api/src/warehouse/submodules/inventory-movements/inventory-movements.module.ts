import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import InventoryMovementsController from './inventory-movements.controller';

@Module({
  imports: [AuthModule],
  controllers: [InventoryMovementsController],
  providers: [PrismaService],
})
export class InventoryMovementsModule {}

export default InventoryMovementsModule;
