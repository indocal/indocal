import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import WarehouseSuppliersController from './suppliers.controller';
import WarehouseSuppliersService from './suppliers.service';

@Module({
  imports: [AuthModule],
  controllers: [WarehouseSuppliersController],
  providers: [PrismaService, WarehouseSuppliersService],
  exports: [WarehouseSuppliersService],
})
export class WarehouseSuppliersModule {}

export default WarehouseSuppliersModule;
