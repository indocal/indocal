import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PrismaService } from '@/common';
import { AuthModule, UsersModule } from '@/auth';

import FormsModule from '../../forms.module';

import FormsEntriesController from './entries.controller';
import FormsEntriesService from './entries.service';

@Module({
  imports: [AuthModule, forwardRef(() => FormsModule), UsersModule, HttpModule],
  controllers: [FormsEntriesController],
  providers: [PrismaService, FormsEntriesService],
  exports: [FormsEntriesService],
})
export class FormsEntriesModule {}

export default FormsEntriesModule;
