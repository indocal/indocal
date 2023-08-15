import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import { ServicesCRUDController, ServicesStatsController } from './controllers';

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
  controllers: [ServicesCRUDController, ServicesStatsController],
  providers: [PrismaService],
})
export class ServicesModule {}

export default ServicesModule;
