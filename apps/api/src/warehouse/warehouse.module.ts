import { Module } from '@nestjs/common';

import { SuppliersModule } from './submodules';

@Module({
  imports: [SuppliersModule],
})
export class WarehouseModule {}

export default WarehouseModule;
