import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

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
  providers: [PrismaService],
})
export class WarehouseModule {}

export default WarehouseModule;
