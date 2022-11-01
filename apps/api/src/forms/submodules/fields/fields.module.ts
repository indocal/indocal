import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import FormsFieldsController from './fields.controller';
import FormsFieldsService from './fields.service';

@Module({
  imports: [AuthModule],
  controllers: [FormsFieldsController],
  providers: [PrismaService, FormsFieldsService],
  exports: [FormsFieldsService],
})
export class FormsFieldsModule {}

export default FormsFieldsModule;
