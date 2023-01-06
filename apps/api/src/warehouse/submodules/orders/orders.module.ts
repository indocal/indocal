import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import OrdersController from './orders.controller';

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [PrismaService],
})
export class OrdersModule {}

export default OrdersModule;
