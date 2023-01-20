import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import InventoryMovementsItemsController from './inventory-movements-items.controller';

@Module({
  imports: [AuthModule],
  controllers: [InventoryMovementsItemsController],
  providers: [PrismaService],
})
export class InventoryMovementsItemsModule {}

export default InventoryMovementsItemsModule;
