import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import OrdersItemsController from './orders-items.controller';
import OrdersItemsService from './orders-items.service';

@Module({
  imports: [AuthModule],
  controllers: [OrdersItemsController],
  providers: [PrismaService, OrdersItemsService],
  exports: [OrdersItemsService],
})
export class OrdersItemsModule {}

export default OrdersItemsModule;
