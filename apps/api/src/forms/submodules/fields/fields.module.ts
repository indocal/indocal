import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import FormsFieldsController from './fields.controller';

@Module({
  imports: [AuthModule],
  controllers: [FormsFieldsController],
  providers: [PrismaService],
})
export class FormsFieldsModule {}

export default FormsFieldsModule;
