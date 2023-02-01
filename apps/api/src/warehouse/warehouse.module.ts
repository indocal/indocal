import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import WarehouseController from './warehouse.controller';

import {
  SuppliesModule,
  SuppliersModule,
  OrdersModule,
  OrdersItemsModule,
  InventoryMovementsModule,
  InventoryMovementsItemsModule,
} from './submodules';

@Module({
  imports: [
    AuthModule,
    SuppliesModule,
    SuppliersModule,
    OrdersModule,
    OrdersItemsModule,
    InventoryMovementsModule,
    InventoryMovementsItemsModule,
  ],
  controllers: [WarehouseController],
  providers: [PrismaService],
})
export class WarehouseModule {}

export default WarehouseModule;
