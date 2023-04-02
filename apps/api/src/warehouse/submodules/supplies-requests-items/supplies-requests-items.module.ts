import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import SuppliesRequestsItemsController from './supplies-requests-items.controller';

@Module({
  imports: [AuthModule],
  controllers: [SuppliesRequestsItemsController],
  providers: [PrismaService],
})
export class SuppliesRequestsItemsModule {}

export default SuppliesRequestsItemsModule;
