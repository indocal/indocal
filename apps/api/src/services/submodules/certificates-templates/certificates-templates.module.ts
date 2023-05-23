import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from '@/auth';

import ServicesCertificatesTemplatesController from './certificates-templates.controller';

@Module({
  imports: [AuthModule],
  controllers: [ServicesCertificatesTemplatesController],
  providers: [PrismaService],
})
export class ServicesCertificatesTemplatesModule {}

export default ServicesCertificatesTemplatesModule;
