import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import SuppliesController from './supplies.controller';

@Module({
  imports: [AuthModule],
  controllers: [SuppliesController],
  providers: [PrismaService],
})
export class SuppliesModule {}

export default SuppliesModule;
