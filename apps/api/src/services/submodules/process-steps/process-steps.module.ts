import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import ServicesProcessStepsController from './process-steps.controller';

@Module({
  imports: [AuthModule],
  controllers: [ServicesProcessStepsController],
  providers: [PrismaService],
})
export class ServicesProcessStepsModule {}

export default ServicesProcessStepsModule;
