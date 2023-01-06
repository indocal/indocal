import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import OrdersItemsController from './orders-items.controller';

@Module({
  imports: [AuthModule],
  controllers: [OrdersItemsController],
  providers: [PrismaService],
})
export class OrdersItemsModule {}

export default OrdersItemsModule;
