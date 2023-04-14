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
import { ServiceRequest, FormEntry, User, Service } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { FormEntryEntity } from '../../../forms/submodules/entries/entities';
import { UserEntity } from '../../../auth/submodules/users/entities';
import { ServiceEntity } from '../../entities';

import { ServiceRequestEntity } from './entities';
import {
  FindManyServicesRequestsParamsDto,
  CountServicesRequestsParamsDto,
  CreateServiceRequestDto,
  UpdateServiceRequestDto,
} from './dto';

class EnhancedServiceRequest extends ServiceRequestEntity {
  entry: FormEntryEntity;
  requestedBy: UserEntity;
  service: ServiceEntity;
}

type CreateEnhancedServiceRequest = ServiceRequest & {
  entry: FormEntry;
  requestedBy: User;
  service: Service;
};

@Controller('requests')
@UseGuards(PoliciesGuard)
export class ServicesRequestsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedServiceRequest({
    entry,
    requestedBy,
    service,
    ...rest
  }: CreateEnhancedServiceRequest): EnhancedServiceRequest {
    const request = new EnhancedServiceRequest(rest);
    request.entry = new FormEntryEntity(entry);
    request.requestedBy = new UserEntity(requestedBy);
    request.service = new ServiceEntity(service);

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
          answers: createRequestDto.formAnswers,
          form: { connect: { id: service.form.id } },
          answeredBy: { connect: { id: createRequestDto.requestedBy } },
        },
      });

      const request = await tx.serviceRequest.create({
        data: {
          entry: { connect: { id: entry.id } },
          requestedBy: { connect: { id: createRequestDto.requestedBy } },
          service: { connect: { id: createRequestDto.service } },
        },
        include: { entry: true, requestedBy: true, service: true },
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
        include: { entry: true, requestedBy: true, service: true },
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
      include: { entry: true, requestedBy: true, service: true },
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
      include: { entry: true, requestedBy: true, service: true },
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
      include: { entry: true, requestedBy: true, service: true },
    });

    return this.createEnhancedServiceRequest(request);
  }
}

export default ServicesRequestsController;