import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import SuppliesController from './supplies.controller';
import SuppliesService from './supplies.service';

@Module({
  imports: [AuthModule],
  controllers: [SuppliesController],
  providers: [PrismaService, SuppliesService],
  exports: [SuppliesService],
})
export class SuppliesModule {}

export default SuppliesModule;
