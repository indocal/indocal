import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth';
import { PrismaService } from '@/prisma';

import FormsController from './forms.controller';

import { FormsFieldsModule, FormsEntriesModule } from './submodules';

@Module({
  imports: [AuthModule, FormsFieldsModule, FormsEntriesModule],
  controllers: [FormsController],
  providers: [PrismaService],
})
export class FormsModule {}

export default FormsModule;
