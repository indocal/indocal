import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import ServicesCertificatesController from './certificates.controller';

@Module({
  imports: [AuthModule],
  controllers: [ServicesCertificatesController],
  providers: [PrismaService],
})
export class ServicesCertificatesModule {}

export default ServicesCertificatesModule;
