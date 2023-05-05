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
  Form,
  UserGroup,
  User,
} from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { UserGroupEntity } from '../auth/submodules/groups/entities';
import { UserEntity } from '../auth/submodules/users/entities';
import { FormEntity } from '../forms/entities';

import { ServiceEntity } from './entities';
import {
  FindManyServicesParamsDto,
  CountServicesParamsDto,
  CreateServiceDto,
  UpdateServiceDto,
} from './dto';

import { ServiceProcessStepEntity } from './submodules/process-steps/entities';

class EnhancedServiceProcessStep extends ServiceProcessStepEntity {
  owners: UserEntity[];
  prevStepOnReject: ServiceProcessStepEntity | null;
  prevStepOnApprove: ServiceProcessStepEntity | null;
  nextStepOnReject: ServiceProcessStepEntity | null;
  nextStepOnApprove: ServiceProcessStepEntity | null;
}

class EnhancedService extends ServiceEntity {
  steps: EnhancedServiceProcessStep[];
  form: FormEntity;
  group: UserGroupEntity;
}

type CreateEnhancedService = Service & {
  form: Form & { group: UserGroup };
  steps: Array<
    ServiceProcessStep & {
      owners: User[];
      prevStepOnReject: ServiceProcessStep | null;
      prevStepOnApprove: ServiceProcessStep | null;
      nextStepOnReject: ServiceProcessStep | null;
      nextStepOnApprove: ServiceProcessStep | null;
    }
  >;
};

@Controller('services')
@UseGuards(PoliciesGuard)
export class ServicesController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedService({
    steps,
    form: { group, ...form },
    ...rest
  }: CreateEnhancedService): EnhancedService {
    const service = new EnhancedService(rest);
    service.form = new FormEntity(form);
    service.group = new UserGroupEntity(group);

    service.steps = steps.map(
      ({
        owners,
        prevStepOnReject,
        prevStepOnApprove,
        nextStepOnReject,
        nextStepOnApprove,
        ...rest
      }) => {
        const step = new EnhancedServiceProcessStep(rest);

        step.owners = owners.map((owner) => new UserEntity(owner));

        step.prevStepOnReject = prevStepOnReject
          ? new ServiceProcessStepEntity(prevStepOnReject)
          : null;

        step.nextStepOnReject = nextStepOnReject
          ? new ServiceProcessStepEntity(nextStepOnReject)
          : null;

        step.prevStepOnApprove = prevStepOnApprove
          ? new ServiceProcessStepEntity(prevStepOnApprove)
          : null;

        step.nextStepOnApprove = nextStepOnApprove
          ? new ServiceProcessStepEntity(nextStepOnApprove)
          : null;

        return step;
      }
    );

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
        steps: {
          include: {
            owners: true,
            prevStepOnReject: true,
            prevStepOnApprove: true,
            nextStepOnReject: true,
            nextStepOnApprove: true,
          },
        },
        form: { include: { group: true } },
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
          steps: {
            include: {
              owners: true,
              prevStepOnReject: true,
              prevStepOnApprove: true,
              nextStepOnReject: true,
              nextStepOnApprove: true,
            },
          },
          form: { include: { group: true } },
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
        steps: {
          include: {
            owners: true,
            prevStepOnReject: true,
            prevStepOnApprove: true,
            nextStepOnReject: true,
            nextStepOnApprove: true,
          },
        },
        form: { include: { group: true } },
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
        steps: {
          include: {
            owners: true,
            prevStepOnReject: true,
            prevStepOnApprove: true,
            nextStepOnReject: true,
            nextStepOnApprove: true,
          },
        },
        form: { include: { group: true } },
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
        steps: {
          include: {
            owners: true,
            prevStepOnReject: true,
            prevStepOnApprove: true,
            nextStepOnReject: true,
            nextStepOnApprove: true,
          },
        },
        form: { include: { group: true } },
      },
    });

    return this.createEnhancedService(service);
  }
}

export default ServicesController;
