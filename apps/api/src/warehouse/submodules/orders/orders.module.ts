import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import OrdersController from './orders.controller';

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [PrismaService],
})
export class OrdersModule {}

export default OrdersModule;
