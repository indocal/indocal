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

import { CalcFormEntriesPerMonthParamsDto } from '../dto';
import { FormEntriesPerMonth } from '../types';

@Controller()
@UseGuards(PoliciesGuard)
export class FormsEntriesStatsController {
  constructor(private prismaService: PrismaService) {}

  @Get('entries/stats/:id/entries-per-month')
  @CheckPolicies((ability) => ability.can('generate-reports', 'form'))
  async formEntriesPerMonth(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Query() query: CalcFormEntriesPerMonthParamsDto
  ): Promise<FormEntriesPerMonth[]> {
    const year = new Date(query.year);

    const start = startOfYear(year);
    const end = endOfYear(year);

    const records = await this.prismaService.formEntry.findMany({
      where: {
        form: { id },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: { id: true, createdAt: true },
    });

    const entriesPerMonth: FormEntriesPerMonth[] = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date();

      date.setMonth(i);

      const month = date.getMonth();

      const entries = records.filter(
        (record) => record.createdAt.getMonth() === month
      );

      entriesPerMonth.push({
        month: date.toLocaleString('es', { month: 'short' }),
        count: entries.length,
      });
    }

    return entriesPerMonth;
  }
}

export default FormsEntriesStatsController;
