import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import ServicesController from './services.controller';

import {
  ServicesProcessStepsModule,
  ServicesCertificatesTemplatesModule,
  ServicesRequestsModule,
  ServicesCertificatesModule,
} from './submodules';

@Module({
  imports: [
    AuthModule,
    ServicesProcessStepsModule,
    ServicesCertificatesTemplatesModule,
    ServicesRequestsModule,
    ServicesCertificatesModule,
  ],
  controllers: [ServicesController],
  providers: [PrismaService],
})
export class ServicesModule {}

export default ServicesModule;
