import { Module } from '@nestjs/common';

import { SuppliesModule, SuppliersModule } from './submodules';

@Module({
  imports: [SuppliesModule, SuppliersModule],
})
export class WarehouseModule {}

export default WarehouseModule;
