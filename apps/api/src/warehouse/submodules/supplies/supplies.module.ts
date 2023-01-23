import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import { SuppliesCRUDController, SuppliesStatsController } from './controllers';

@Module({
  imports: [AuthModule],
  controllers: [SuppliesCRUDController, SuppliesStatsController],
  providers: [PrismaService],
})
export class SuppliesModule {}

export default SuppliesModule;
