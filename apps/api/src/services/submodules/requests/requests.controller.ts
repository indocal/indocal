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
  ServiceRequest,
  FormEntry,
  User,
  Service,
  ServiceProcessStep,
} from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { FormEntryEntity } from '../../../forms/submodules/entries/entities';
import { UserEntity } from '../../../auth/submodules/users/entities';
import { ServiceEntity } from '../../entities';

import { ServiceProcessStepEntity } from '../process-steps/entities';

import { ServiceRequestEntity } from './entities';
import {
  FindManyServicesRequestsParamsDto,
  CountServicesRequestsParamsDto,
  CreateServiceRequestDto,
  UpdateServiceRequestDto,
} from './dto';

class EnhancedServiceProcessStep extends ServiceProcessStepEntity {
  owners: UserEntity[];
  prevStepOnReject: ServiceProcessStepEntity | null;
  prevStepOnApprove: ServiceProcessStepEntity | null;
  nextStepOnReject: ServiceProcessStepEntity | null;
  nextStepOnApprove: ServiceProcessStepEntity | null;
}

class EnhancedServiceRequest extends ServiceRequestEntity {
  entry: FormEntryEntity;
  requestedBy: UserEntity;
  service: ServiceEntity;
  currentStep: EnhancedServiceProcessStep | null;
}

type CreateEnhancedServiceRequest = ServiceRequest & {
  entry: FormEntry;
  requestedBy: User;
  service: Service;
  currentStep:
    | (ServiceProcessStep & {
        owners: User[];
        prevStepOnReject: ServiceProcessStep | null;
        prevStepOnApprove: ServiceProcessStep | null;
        nextStepOnReject: ServiceProcessStep | null;
        nextStepOnApprove: ServiceProcessStep | null;
      })
    | null;
};

@Controller('requests')
@UseGuards(PoliciesGuard)
export class ServicesRequestsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedServiceRequest({
    entry,
    requestedBy,
    service,
    currentStep,
    ...rest
  }: CreateEnhancedServiceRequest): EnhancedServiceRequest {
    const request = new EnhancedServiceRequest(rest);
    request.entry = new FormEntryEntity(entry);
    request.requestedBy = new UserEntity(requestedBy);
    request.service = new ServiceEntity(service);

    if (currentStep) {
      request.currentStep = new EnhancedServiceProcessStep(currentStep);

      request.currentStep.owners = currentStep.owners.map(
        (owner) => new UserEntity(owner)
      );

      request.currentStep.prevStepOnReject = currentStep.prevStepOnReject
        ? new ServiceProcessStepEntity(currentStep.prevStepOnReject)
        : null;

      request.currentStep.nextStepOnReject = currentStep.nextStepOnReject
        ? new ServiceProcessStepEntity(currentStep.nextStepOnReject)
        : null;

      request.currentStep.prevStepOnApprove = currentStep.prevStepOnApprove
        ? new ServiceProcessStepEntity(currentStep.prevStepOnApprove)
        : null;

      request.currentStep.nextStepOnApprove = currentStep.nextStepOnApprove
        ? new ServiceProcessStepEntity(currentStep.nextStepOnApprove)
        : null;
    } else {
      request.currentStep = null;
    }

    return request;
  }

  @Post()
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('create', 'serviceRequest'),
  })
  async create(
    @Body() createRequestDto: CreateServiceRequestDto
  ): Promise<SingleEntityResponse<EnhancedServiceRequest>> {
    const request = await this.prismaService.$transaction(async (tx) => {
      const service = await tx.service.findUniqueOrThrow({
        where: { id: createRequestDto.service },
        include: { form: true },
      });

      const entry = await tx.formEntry.create({
        data: {
          answers: createRequestDto.answers,
          form: { connect: { id: service.form.id } },
          answeredBy: { connect: { id: createRequestDto.requestedBy } },
        },
      });

      const firstStep = await tx.serviceProcessStep.findFirst({
        where: {
          service: { id: service.id },
          prevStepOnApprove: null,
          prevStepOnReject: null,
        },
      });

      const request = await tx.serviceRequest.create({
        data: {
          entry: { connect: { id: entry.id } },
          requestedBy: { connect: { id: createRequestDto.requestedBy } },
          service: { connect: { id: createRequestDto.service } },
          ...(firstStep && { currentStep: { connect: { id: firstStep.id } } }),
        },
        include: {
          entry: true,
          requestedBy: true,
          service: true,
          currentStep: {
            include: {
              owners: true,
              prevStepOnReject: true,
              prevStepOnApprove: true,
              nextStepOnReject: true,
              nextStepOnApprove: true,
            },
          },
        },
      });

      return request;
    });

    return this.createEnhancedServiceRequest(request);
  }

  @Get('count')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('count', 'serviceRequest'),
  })
  async count(@Query() query: CountServicesRequestsParamsDto): Promise<number> {
    return await this.prismaService.serviceRequest.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'serviceRequest'),
  })
  async findMany(
    @Query() query: FindManyServicesRequestsParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedServiceRequest>> {
    const [requests, count] = await this.prismaService.$transaction([
      this.prismaService.serviceRequest.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: {
          entry: true,
          requestedBy: true,
          service: true,
          currentStep: {
            include: {
              owners: true,
              prevStepOnReject: true,
              prevStepOnApprove: true,
              nextStepOnReject: true,
              nextStepOnApprove: true,
            },
          },
        },
      }),
      this.prismaService.serviceRequest.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: requests.map((request) =>
        this.createEnhancedServiceRequest(request)
      ),
    };
  }

  @Get(':id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'serviceRequest'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceRequest | null>> {
    const request = await this.prismaService.serviceRequest.findUnique({
      where: { id },
      include: {
        entry: true,
        requestedBy: true,
        service: true,
        currentStep: {
          include: {
            owners: true,
            prevStepOnReject: true,
            prevStepOnApprove: true,
            nextStepOnReject: true,
            nextStepOnApprove: true,
          },
        },
      },
    });

    return request ? this.createEnhancedServiceRequest(request) : null;
  }

  @Patch(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('update', 'serviceRequest'),
  })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateRequestDto: UpdateServiceRequestDto
  ): Promise<SingleEntityResponse<EnhancedServiceRequest>> {
    const request = await this.prismaService.serviceRequest.update({
      where: { id },
      data: { status: updateRequestDto.status },
      include: {
        entry: true,
        requestedBy: true,
        service: true,
        currentStep: {
          include: {
            owners: true,
            prevStepOnReject: true,
            prevStepOnApprove: true,
            nextStepOnReject: true,
            nextStepOnApprove: true,
          },
        },
      },
    });

    return this.createEnhancedServiceRequest(request);
  }

  @Delete(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('delete', 'serviceRequest'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceRequest>> {
    const request = await this.prismaService.serviceRequest.delete({
      where: { id },
      include: {
        entry: true,
        requestedBy: true,
        service: true,
        currentStep: {
          include: {
            owners: true,
            prevStepOnReject: true,
            prevStepOnApprove: true,
            nextStepOnReject: true,
            nextStepOnApprove: true,
          },
        },
      },
    });

    return this.createEnhancedServiceRequest(request);
  }
}

export default ServicesRequestsController;
