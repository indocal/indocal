import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import FilesController from './files.controller';

@Module({
  imports: [AuthModule],
  controllers: [FilesController],
  providers: [PrismaService],
})
export class FilesModule {}

export default FilesModule;
