import { Module } from '@nestjs/common';

import {
  SuppliesModule,
  SuppliersModule,
  OrdersModule,
  OrdersItemsModule,
} from './submodules';

@Module({
  imports: [SuppliesModule, SuppliersModule, OrdersModule, OrdersItemsModule],
})
export class WarehouseModule {}

export default WarehouseModule;
