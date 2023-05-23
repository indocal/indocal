import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import ServicesController from './services.controller';

import {
  ServicesProcessStepsModule,
  ServicesRequestsModule,
  ServicesCertificatesTemplatesModule,
} from './submodules';

@Module({
  imports: [
    AuthModule,
    ServicesProcessStepsModule,
    ServicesRequestsModule,
    ServicesCertificatesTemplatesModule,
  ],
  controllers: [ServicesController],
  providers: [PrismaService],
})
export class ServicesModule {}

export default ServicesModule;
