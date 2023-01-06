import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import SuppliersController from './suppliers.controller';

@Module({
  imports: [AuthModule],
  controllers: [SuppliersController],
  providers: [PrismaService],
})
export class SuppliersModule {}

export default SuppliersModule;
