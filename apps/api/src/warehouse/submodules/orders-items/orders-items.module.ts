import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import OrdersItemsController from './orders-items.controller';

@Module({
  imports: [AuthModule],
  controllers: [OrdersItemsController],
  providers: [PrismaService],
})
export class OrdersItemsModule {}

export default OrdersItemsModule;
