import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import SuppliersController from './suppliers.controller';
import SuppliersService from './suppliers.service';

@Module({
  imports: [AuthModule],
  controllers: [SuppliersController],
  providers: [PrismaService, SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}

export default SuppliersModule;
