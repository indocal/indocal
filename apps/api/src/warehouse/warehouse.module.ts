import { Module } from '@nestjs/common';

import { WarehouseSuppliersModule } from './submodules';

@Module({
  imports: [WarehouseSuppliersModule],
})
export class WarehouseModule {}

export default WarehouseModule;
