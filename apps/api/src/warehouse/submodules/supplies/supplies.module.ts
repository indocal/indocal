import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import { SuppliesCRUDController, SuppliesStatsController } from './controllers';

@Module({
  imports: [AuthModule],
  controllers: [SuppliesCRUDController, SuppliesStatsController],
  providers: [PrismaService],
})
export class SuppliesModule {}

export default SuppliesModule;
