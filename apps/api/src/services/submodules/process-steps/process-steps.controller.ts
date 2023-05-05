import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ServiceProcessStep, Service, User } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { UserEntity } from '../../../auth/submodules/users/entities';
import { ServiceEntity } from '../../entities';

import { ServiceProcessStepEntity } from './entities';
import {
  CreateServiceProcessStepDto,
  UpdateServiceProcessStepDto,
} from './dto';

class EnhancedServiceProcessStep extends ServiceProcessStepEntity {
  owners: UserEntity[];
  prevFailureStep: ServiceProcessStepEntity | null;
  nextFailureStep: ServiceProcessStepEntity | null;
  prevSuccessStep: ServiceProcessStepEntity | null;
  nextSuccessStep: ServiceProcessStepEntity | null;
  service: ServiceEntity;
}

type CreateEnhancedServiceProcessStep = ServiceProcessStep & {
  owners: User[];
  prevFailureStep: ServiceProcessStep | null;
  nextFailureStep: ServiceProcessStep | null;
  prevSuccessStep: ServiceProcessStep | null;
  nextSuccessStep: ServiceProcessStep | null;
  service: Service;
};

@Controller()
@UseGuards(PoliciesGuard)
export class ServicesProcessStepsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedServiceProcessStep({
    owners,
    prevFailureStep,
    nextFailureStep,
    prevSuccessStep,
    nextSuccessStep,
    service,
    ...rest
  }: CreateEnhancedServiceProcessStep): EnhancedServiceProcessStep {
    const step = new EnhancedServiceProcessStep(rest);

    step.owners = owners.map((owner) => new UserEntity(owner));

    step.prevFailureStep = prevFailureStep
      ? new ServiceProcessStepEntity(prevFailureStep)
      : null;

    step.nextFailureStep = nextFailureStep
      ? new ServiceProcessStepEntity(nextFailureStep)
      : null;

    step.prevSuccessStep = prevSuccessStep
      ? new ServiceProcessStepEntity(prevSuccessStep)
      : null;

    step.nextSuccessStep = nextSuccessStep
      ? new ServiceProcessStepEntity(nextSuccessStep)
      : null;

    step.service = new ServiceEntity(service);

    return step;
  }

  @Post('services/:service_id/steps')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('create', 'service'),
  })
  async create(
    @Param('service_id') serviceId: UUID,
    @Body() createStepDto: CreateServiceProcessStepDto
  ): Promise<SingleEntityResponse<EnhancedServiceProcessStep>> {
    const step = await this.prismaService.serviceProcessStep.create({
      data: {
        title: createStepDto.title,
        description: createStepDto.description,
        owners: { connect: createStepDto.owners.map((id) => ({ id })) },
        service: { connect: { id: serviceId } },

        ...(createStepDto.prevFailureStep && {
          prevFailureStep: { connect: { id: createStepDto.prevFailureStep } },
        }),

        ...(createStepDto.nextFailureStep && {
          nextFailureStep: { connect: { id: createStepDto.nextFailureStep } },
        }),

        ...(createStepDto.prevSuccessStep && {
          prevSuccessStep: { connect: { id: createStepDto.prevSuccessStep } },
        }),

        ...(createStepDto.nextSuccessStep && {
          nextSuccessStep: { connect: { id: createStepDto.nextSuccessStep } },
        }),
      },
      include: {
        owners: true,
        prevFailureStep: true,
        prevSuccessStep: true,
        nextFailureStep: true,
        nextSuccessStep: true,
        service: true,
      },
    });

    return this.createEnhancedServiceProcessStep(step);
  }

  @Get('services/:service_id/steps/count')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('count', 'service'),
  })
  async count(@Param('service_id') serviceId: UUID): Promise<number> {
    return await this.prismaService.serviceProcessStep.count({
      where: { service: { id: serviceId } },
    });
  }

  @Get('services/:service_id/steps')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'service'),
  })
  async findAll(
    @Param('service_id') serviceId: UUID
  ): Promise<MultipleEntitiesResponse<EnhancedServiceProcessStep>> {
    const [steps, count] = await this.prismaService.$transaction([
      this.prismaService.serviceProcessStep.findMany({
        where: { service: { id: serviceId } },
        include: {
          owners: true,
          prevFailureStep: true,
          prevSuccessStep: true,
          nextFailureStep: true,
          nextSuccessStep: true,
          service: true,
        },
      }),
      this.prismaService.serviceProcessStep.count({
        where: { service: { id: serviceId } },
      }),
    ]);

    return {
      count,
      entities: steps.map((step) =>
        this.createEnhancedServiceProcessStep(step)
      ),
    };
  }

  @Get('services/steps/:id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'service'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceProcessStep | null>> {
    const step = await this.prismaService.serviceProcessStep.findUnique({
      where: { id },
      include: {
        owners: true,
        prevFailureStep: true,
        prevSuccessStep: true,
        nextFailureStep: true,
        nextSuccessStep: true,
        service: true,
      },
    });

    return step ? this.createEnhancedServiceProcessStep(step) : null;
  }

  @Patch('services/steps/:id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('update', 'service'),
  })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateStepDto: UpdateServiceProcessStepDto
  ): Promise<SingleEntityResponse<EnhancedServiceProcessStep>> {
    const step = await this.prismaService.serviceProcessStep.update({
      where: { id },
      data: {
        title: updateStepDto.title,
        description: updateStepDto.description,

        ...(updateStepDto.owners && {
          owners: { set: updateStepDto.owners.map((id) => ({ id })) },
        }),

        ...(typeof updateStepDto.prevFailureStep !== 'undefined' && {
          prevFailureStep: updateStepDto.prevFailureStep
            ? { connect: { id: updateStepDto.prevFailureStep } }
            : { disconnect: true },
        }),

        ...(typeof updateStepDto.nextFailureStep !== 'undefined' && {
          nextFailureStep: updateStepDto.nextFailureStep
            ? { connect: { id: updateStepDto.nextFailureStep } }
            : { disconnect: true },
        }),

        ...(typeof updateStepDto.prevSuccessStep !== 'undefined' && {
          prevSuccessStep: updateStepDto.prevSuccessStep
            ? { connect: { id: updateStepDto.prevSuccessStep } }
            : { disconnect: true },
        }),

        ...(typeof updateStepDto.nextSuccessStep !== 'undefined' && {
          nextSuccessStep: updateStepDto.nextSuccessStep
            ? { connect: { id: updateStepDto.nextSuccessStep } }
            : { disconnect: true },
        }),
      },
      include: {
        owners: true,
        prevFailureStep: true,
        prevSuccessStep: true,
        nextFailureStep: true,
        nextSuccessStep: true,
        service: true,
      },
    });

    return this.createEnhancedServiceProcessStep(step);
  }

  @Delete('services/steps/:id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('delete', 'service'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceProcessStep>> {
    const step = await this.prismaService.serviceProcessStep.delete({
      where: { id },
      include: {
        owners: true,
        prevFailureStep: true,
        prevSuccessStep: true,
        nextFailureStep: true,
        nextSuccessStep: true,
        service: true,
      },
    });

    return this.createEnhancedServiceProcessStep(step);
  }
}

export default ServicesProcessStepsController;
