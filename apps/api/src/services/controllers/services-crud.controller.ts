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
  Service,
  ServiceProcessStep,
  ServiceCertificateTemplate,
  File,
  Form,
  UserGroup,
  User,
} from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { FileEntity } from '../../uploads/submodules/files/entities';
import { FormEntity } from '../../forms/entities';
import { UserGroupEntity } from '../../auth/submodules/groups/entities';
import { UserEntity } from '../../auth/submodules/users/entities';

import { ServiceEntity } from '../entities';
import {
  FindManyServicesParamsDto,
  CountServicesParamsDto,
  CreateServiceDto,
  UpdateServiceDto,
} from '../dto';

import { ServiceProcessStepEntity } from '../submodules/process-steps/entities';
import { ServiceCertificateTemplateEntity } from '../submodules/certificates-templates/entities';

class EnhancedServiceProcessStep extends ServiceProcessStepEntity {
  owners: UserEntity[];
  prevStepsOnReject: ServiceProcessStepEntity[];
  prevStepsOnApprove: ServiceProcessStepEntity[];
  nextStepOnReject: ServiceProcessStepEntity | null;
  nextStepOnApprove: ServiceProcessStepEntity | null;
}

class EnhancedServiceCertificateTemplate extends ServiceCertificateTemplateEntity {
  assets: FileEntity[];
}

class EnhancedService extends ServiceEntity {
  form: FormEntity;
  group: UserGroupEntity;
  steps: EnhancedServiceProcessStep[];
  template: EnhancedServiceCertificateTemplate | null;
}

type CreateEnhancedService = Service & {
  form: Form & { group: UserGroup };
  steps: Array<
    ServiceProcessStep & {
      owners: User[];
      prevStepsOnReject: ServiceProcessStep[];
      prevStepsOnApprove: ServiceProcessStep[];
      nextStepOnReject: ServiceProcessStep | null;
      nextStepOnApprove: ServiceProcessStep | null;
    }
  >;
  template: (ServiceCertificateTemplate & { assets: File[] }) | null;
};

@Controller('services')
@UseGuards(PoliciesGuard)
export class ServicesCRUDController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedService({
    form: { group, ...form },
    steps,
    template,
    ...rest
  }: CreateEnhancedService): EnhancedService {
    const service = new EnhancedService(rest);
    service.form = new FormEntity(form);
    service.group = new UserGroupEntity(group);

    service.steps = steps.map(
      ({
        owners,
        prevStepsOnReject,
        prevStepsOnApprove,
        nextStepOnReject,
        nextStepOnApprove,
        ...rest
      }) => {
        const step = new EnhancedServiceProcessStep(rest);

        step.owners = owners.map((owner) => new UserEntity(owner));

        step.prevStepsOnReject = prevStepsOnReject.map(
          (step) => new ServiceProcessStepEntity(step)
        );

        step.nextStepOnReject = nextStepOnReject
          ? new ServiceProcessStepEntity(nextStepOnReject)
          : null;

        step.prevStepsOnApprove = prevStepsOnApprove.map(
          (step) => new ServiceProcessStepEntity(step)
        );

        step.nextStepOnApprove = nextStepOnApprove
          ? new ServiceProcessStepEntity(nextStepOnApprove)
          : null;

        return step;
      }
    );

    if (template) {
      const { assets, ...rest } = template;

      service.template = new EnhancedServiceCertificateTemplate(rest);

      service.template.assets = assets.map((asset) => new FileEntity(asset));
    } else {
      service.template = null;
    }

    return service;
  }

  @Post()
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('create', 'service'),
  })
  async create(
    @Body() createServiceDto: CreateServiceDto
  ): Promise<SingleEntityResponse<EnhancedService>> {
    const service = await this.prismaService.service.create({
      data: {
        title: createServiceDto.title,
        description: createServiceDto.description,
        supportedRequestStatus: createServiceDto.supportedRequestStatus,
        form: { connect: { id: createServiceDto.form } },
      },
      include: {
        form: { include: { group: true } },
        steps: {
          include: {
            owners: true,
            prevStepsOnReject: true,
            prevStepsOnApprove: true,
            nextStepOnReject: true,
            nextStepOnApprove: true,
          },
        },
        template: { include: { assets: true } },
      },
    });

    return this.createEnhancedService(service);
  }

  @Get('count')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('count', 'service'),
  })
  async count(@Query() query: CountServicesParamsDto): Promise<number> {
    return await this.prismaService.service.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'service'),
  })
  async findMany(
    @Query() query: FindManyServicesParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedService>> {
    const [services, count] = await this.prismaService.$transaction([
      this.prismaService.service.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: {
          form: { include: { group: true } },
          steps: {
            include: {
              owners: true,
              prevStepsOnReject: true,
              prevStepsOnApprove: true,
              nextStepOnReject: true,
              nextStepOnApprove: true,
            },
          },
          template: { include: { assets: true } },
        },
      }),
      this.prismaService.service.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: services.map((service) => this.createEnhancedService(service)),
    };
  }

  @Get(':id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'service'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedService | null>> {
    const service = await this.prismaService.service.findUnique({
      where: { id },
      include: {
        form: { include: { group: true } },
        steps: {
          include: {
            owners: true,
            prevStepsOnReject: true,
            prevStepsOnApprove: true,
            nextStepOnReject: true,
            nextStepOnApprove: true,
          },
        },
        template: { include: { assets: true } },
      },
    });

    return service ? this.createEnhancedService(service) : null;
  }

  @Patch(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('update', 'service'),
  })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateServiceDto: UpdateServiceDto
  ): Promise<SingleEntityResponse<EnhancedService>> {
    const service = await this.prismaService.service.update({
      where: { id },
      data: {
        title: updateServiceDto.title,
        description: updateServiceDto.description,
        status: updateServiceDto.status,
        supportedRequestStatus: updateServiceDto.supportedRequestStatus,

        ...(updateServiceDto.form && {
          form: { connect: { id: updateServiceDto.form } },
        }),
      },
      include: {
        form: { include: { group: true } },
        steps: {
          include: {
            owners: true,
            prevStepsOnReject: true,
            prevStepsOnApprove: true,
            nextStepOnReject: true,
            nextStepOnApprove: true,
          },
        },
        template: { include: { assets: true } },
      },
    });

    return this.createEnhancedService(service);
  }

  @Delete(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('delete', 'service'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedService>> {
    const service = await this.prismaService.service.delete({
      where: { id },
      include: {
        form: { include: { group: true } },
        steps: {
          include: {
            owners: true,
            prevStepsOnReject: true,
            prevStepsOnApprove: true,
            nextStepOnReject: true,
            nextStepOnApprove: true,
          },
        },
        template: { include: { assets: true } },
      },
    });

    return this.createEnhancedService(service);
  }
}

export default ServicesCRUDController;
