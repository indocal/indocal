import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import FormsFieldsController from './fields.controller';

@Module({
  imports: [AuthModule],
  controllers: [FormsFieldsController],
  providers: [PrismaService],
})
export class FormsFieldsModule {}

export default FormsFieldsModule;
