import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ServiceCertificateTemplate, Service } from '@prisma/client';

import { UUID, SingleEntityResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { ServiceEntity } from '../../entities';

import { ServiceCertificateTemplateEntity } from './entities';
import { UpsertServiceCertificateTemplateDto } from './dto';

class EnhancedServiceCertificateTemplate extends ServiceCertificateTemplateEntity {
  service: ServiceEntity;
}

type CreateEnhancedServiceCertificateTemplate = ServiceCertificateTemplate & {
  service: Service;
};

@Controller()
@UseGuards(PoliciesGuard)
export class ServicesCertificatesTemplatesController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedServiceCertificateTemplate({
    service,
    ...rest
  }: CreateEnhancedServiceCertificateTemplate): EnhancedServiceCertificateTemplate {
    const template = new EnhancedServiceCertificateTemplate(rest);

    template.service = new ServiceEntity(service);

    return template;
  }

  @Get('services/templates/:id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'service'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceCertificateTemplate | null>> {
    const template =
      await this.prismaService.serviceCertificateTemplate.findUnique({
        where: { id },
        include: { service: true },
      });

    return template
      ? this.createEnhancedServiceCertificateTemplate(template)
      : null;
  }

  @Put('services/:service_id/templates')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('create', 'service'),
  })
  async upsert(
    @Param('service_id') serviceId: UUID,
    @Body() upsertTemplateDto: UpsertServiceCertificateTemplateDto
  ): Promise<SingleEntityResponse<EnhancedServiceCertificateTemplate>> {
    const template = await this.prismaService.serviceCertificateTemplate.upsert(
      {
        where: { serviceId },
        create: {
          serviceId,
          layout: upsertTemplateDto.layout,
          content: upsertTemplateDto.content,
          styles: upsertTemplateDto.styles,
          placeholders: upsertTemplateDto.placeholders,
        },
        update: {
          layout: upsertTemplateDto.layout,
          content: upsertTemplateDto.content,
          styles: upsertTemplateDto.styles,
          placeholders: upsertTemplateDto.placeholders,
        },
        include: { service: true },
      }
    );

    return this.createEnhancedServiceCertificateTemplate(template);
  }

  @Delete('services/templates/:id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('delete', 'service'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceCertificateTemplate>> {
    const template = await this.prismaService.serviceCertificateTemplate.delete(
      {
        where: { id },
        include: { service: true },
      }
    );

    return this.createEnhancedServiceCertificateTemplate(template);
  }
}

export default ServicesCertificatesTemplatesController;
