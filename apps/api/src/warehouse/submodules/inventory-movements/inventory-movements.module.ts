import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import InventoryMovementsController from './inventory-movements.controller';

@Module({
  imports: [AuthModule],
  controllers: [InventoryMovementsController],
  providers: [PrismaService],
})
export class InventoryMovementsModule {}

export default InventoryMovementsModule;
