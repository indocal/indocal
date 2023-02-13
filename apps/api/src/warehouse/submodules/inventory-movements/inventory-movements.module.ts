import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import {
  InventoryMovementsCRUDController,
  InventoryMovementsStatsController,
} from './controllers';

@Module({
  imports: [AuthModule],
  controllers: [
    InventoryMovementsCRUDController,
    InventoryMovementsStatsController,
  ],
  providers: [PrismaService],
})
export class InventoryMovementsModule {}

export default InventoryMovementsModule;
