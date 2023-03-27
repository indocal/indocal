import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import { FormsCRUDController, FormsStatsController } from './controllers';

import { FormsFieldsModule, FormsEntriesModule } from './submodules';

@Module({
  imports: [AuthModule, FormsFieldsModule, FormsEntriesModule],
  controllers: [FormsCRUDController, FormsStatsController],
  providers: [PrismaService],
})
export class FormsModule {}

export default FormsModule;
