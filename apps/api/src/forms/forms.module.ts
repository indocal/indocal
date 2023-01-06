import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthModule } from '@/auth';

import FormsController from './forms.controller';

import { FormsFieldsModule, FormsEntriesModule } from './submodules';

@Module({
  imports: [AuthModule, FormsFieldsModule, FormsEntriesModule],
  controllers: [FormsController],
  providers: [PrismaService],
})
export class FormsModule {}

export default FormsModule;
