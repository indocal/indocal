import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import { OrdersCRUDController, OrdersActionsController } from './controllers';

@Module({
  imports: [AuthModule],
  controllers: [OrdersCRUDController, OrdersActionsController],
  providers: [PrismaService],
})
export class OrdersModule {}

export default OrdersModule;
