import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import {
  SuppliesRequestsCRUDController,
  SuppliesRequestsActionsController,
} from './controllers';

@Module({
  imports: [AuthModule],
  controllers: [
    SuppliesRequestsCRUDController,
    SuppliesRequestsActionsController,
  ],
  providers: [PrismaService],
})
export class SuppliesRequestsModule {}

export default SuppliesRequestsModule;
