import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import { SuppliesModule } from '../supplies';
import { SuppliersModule } from '../suppliers';

import OrdersController from './orders.controller';
import OrdersService from './orders.service';

import { OrdersItemsModule } from '../orders-items';

@Module({
  imports: [AuthModule, OrdersItemsModule, SuppliesModule, SuppliersModule],
  controllers: [OrdersController],
  providers: [PrismaService, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

export default OrdersModule;
