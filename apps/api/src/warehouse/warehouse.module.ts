import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

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
