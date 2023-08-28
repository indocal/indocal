import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  ServiceCertificate,
  ServiceCertificateTemplate,
  ServiceRequest,
  Service,
  File,
  User,
} from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { UserEntity } from '../../../auth/submodules/users';
import { FileEntity } from '../../../uploads/submodules/files';

import { ServiceEntity } from '../../entities';

import { ServiceCertificateTemplateEntity } from '../certificates-templates';
import { ServiceRequestEntity } from '../requests';

import { ServiceCertificateEntity } from './entities';
import {
  FindManyServicesCertificatesParamsDto,
  CountServicesCertificatesParamsDto,
  CreateServiceCertificateDto,
  UpdateServiceCertificateDto,
} from './dto';

class EnhancedServiceCertificateTemplate extends ServiceCertificateTemplateEntity {
  assets: FileEntity[];
}

class EnhancedServiceCertificate extends ServiceCertificateEntity {
  template: EnhancedServiceCertificateTemplate;
  request: ServiceRequestEntity;
  service: ServiceEntity;
  user: UserEntity;
}

type CreateEnhancedServiceCertificate = ServiceCertificate & {
  template: ServiceCertificateTemplate & { assets: File[] };
  request: ServiceRequest & { service: Service; requestedBy: User };
};

@Controller('certificates')
@UseGuards(PoliciesGuard)
export class ServicesCertificatesController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedServiceCertificate({
    template: { assets, ...template },
    request: { service, requestedBy, ...request },
    ...rest
  }: CreateEnhancedServiceCertificate): EnhancedServiceCertificate {
    const certificate = new EnhancedServiceCertificate(rest);

    certificate.template = new EnhancedServiceCertificateTemplate(template);

    certificate.template.assets = assets.map((asset) => new FileEntity(asset));

    certificate.request = new ServiceRequestEntity(request);

    certificate.service = new ServiceEntity(service);

    certificate.user = new UserEntity(requestedBy);

    return certificate;
  }

  @Post()
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('create', 'serviceCertificate'),
  })
  async create(
    @Body() createCertificateDto: CreateServiceCertificateDto
  ): Promise<SingleEntityResponse<EnhancedServiceCertificate>> {
    const certificate = await this.prismaService.serviceCertificate.create({
      data: {
        template: { connect: { id: createCertificateDto.template } },
        request: { connect: { id: createCertificateDto.request } },
        data: createCertificateDto.data,
      },
      include: {
        template: { include: { assets: true } },
        request: { include: { service: true, requestedBy: true } },
      },
    });

    return this.createEnhancedServiceCertificate(certificate);
  }

  @Get('count')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('count', 'serviceCertificate'),
  })
  async count(
    @Query() query: CountServicesCertificatesParamsDto
  ): Promise<number> {
    return await this.prismaService.serviceCertificate.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'serviceCertificate'),
  })
  async findMany(
    @Query() query: FindManyServicesCertificatesParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedServiceCertificate>> {
    const [requests, count] = await this.prismaService.$transaction([
      this.prismaService.serviceCertificate.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: {
          template: { include: { assets: true } },
          request: { include: { service: true, requestedBy: true } },
        },
      }),
      this.prismaService.serviceCertificate.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: requests.map((request) =>
        this.createEnhancedServiceCertificate(request)
      ),
    };
  }

  @Get(':id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'serviceCertificate'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceCertificate | null>> {
    const certificate = await this.prismaService.serviceCertificate.findUnique({
      where: { id },
      include: {
        template: { include: { assets: true } },
        request: { include: { service: true, requestedBy: true } },
      },
    });

    return certificate
      ? this.createEnhancedServiceCertificate(certificate)
      : null;
  }

  @Patch(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('update', 'serviceCertificate'),
  })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateCertificateDto: UpdateServiceCertificateDto
  ): Promise<SingleEntityResponse<EnhancedServiceCertificate>> {
    const certificate = await this.prismaService.serviceCertificate.update({
      where: { id },
      data: {
        template: { connect: { id: updateCertificateDto.template } },
        request: { connect: { id: updateCertificateDto.request } },
        data: updateCertificateDto.data,
      },
      include: {
        template: { include: { assets: true } },
        request: { include: { service: true, requestedBy: true } },
      },
    });

    return this.createEnhancedServiceCertificate(certificate);
  }

  @Delete(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('delete', 'serviceCertificate'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceCertificate>> {
    const certificate = await this.prismaService.serviceCertificate.delete({
      where: { id },
      include: {
        template: { include: { assets: true } },
        request: { include: { service: true, requestedBy: true } },
      },
    });

    return this.createEnhancedServiceCertificate(certificate);
  }
}

export default ServicesCertificatesController;
