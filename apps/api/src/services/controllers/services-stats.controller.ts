import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { startOfYear, endOfYear } from 'date-fns';

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { calcServiceRequestsPerMonth } from '../utils';
import { CalcServiceRequestsPerMonthParamsDto } from '../dto';
import { ServiceRequestsPerMonth } from '../types';

import { ServiceRequestEntity } from '../submodules/requests/entities';

@Controller()
@UseGuards(PoliciesGuard)
export class ServicesStatsController {
  constructor(private prismaService: PrismaService) {}

  @Get('services/:id/stats/requests-per-month')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('generate-reports', 'service'),
  })
  async calcServiceRequestsPerMonth(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Query() query: CalcServiceRequestsPerMonthParamsDto
  ): Promise<ServiceRequestsPerMonth[]> {
    const year = new Date(query.year);

    const start = startOfYear(year);
    const end = endOfYear(year);

    const records = await this.prismaService.serviceRequest.findMany({
      where: {
        service: { id },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const requests = records.map((record) => new ServiceRequestEntity(record));

    const requestsPerMonth = calcServiceRequestsPerMonth(requests);

    return requestsPerMonth;
  }
}

export default ServicesStatsController;
