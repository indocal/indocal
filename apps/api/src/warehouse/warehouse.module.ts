import { Module } from '@nestjs/common';

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
    SuppliesModule,
    SuppliersModule,
    OrdersModule,
    OrdersItemsModule,
    InventoryMovementsModule,
    InventoryMovementsItemsModule,
  ],
})
export class WarehouseModule {}

export default WarehouseModule;
