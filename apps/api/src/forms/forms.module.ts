import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule, UsersGroupsModule } from '@/auth';

import FormsController from './forms.controller';
import FormsService from './forms.service';

import { FormsFieldsModule } from './submodules';

@Module({
  imports: [AuthModule, UsersGroupsModule, FormsFieldsModule],
  controllers: [FormsController],
  providers: [PrismaService, FormsService],
  exports: [FormsService],
})
export class FormsModule {}

export default FormsModule;
