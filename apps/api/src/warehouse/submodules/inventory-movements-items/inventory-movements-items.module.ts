import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import InventoryMovementsItemsController from './inventory-movements-items.controller';

@Module({
  imports: [AuthModule],
  controllers: [InventoryMovementsItemsController],
  providers: [PrismaService],
})
export class InventoryMovementsItemsModule {}

export default InventoryMovementsItemsModule;
