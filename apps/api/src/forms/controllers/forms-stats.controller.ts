import {
  Controller,
  Get,
  Res,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Response } from 'express';
import { unlinkSync } from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import { tmpNameSync } from 'tmp';
import { startOfYear, endOfYear } from 'date-fns';

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import {
  calcFormEntriesPerMonth,
  calcFormFieldsReports,
  serializeFormEntries,
} from '../utils';
import {
  CalcFormEntriesPerMonthParamsDto,
  CalcFormFieldsReportsParamsDto,
  ExportFormEntriesParamsDto,
} from '../dto';
import { FormEntriesPerMonth, FormFieldReport } from '../types';

import { FormEntryEntity } from '../submodules/entries/entities';

@Controller()
@UseGuards(PoliciesGuard)
export class FormsStatsController {
  constructor(private prismaService: PrismaService) {}

  @Get('forms/:id/stats/entries-per-month')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('generate-reports', 'form'),
  })
  async calcFormEntriesPerMonth(
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
    });

    const entries = records.map((record) => new FormEntryEntity(record));

    const entriesPerMonth = calcFormEntriesPerMonth(entries);

    return entriesPerMonth;
  }

  @Get('forms/:id/stats/fields-reports')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('generate-reports', 'form'),
  })
  async calcFormFieldsReports(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Query() query: CalcFormFieldsReportsParamsDto
  ): Promise<FormFieldReport[]> {
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
    });

    const entries = records.map((record) => new FormEntryEntity(record));

    const reports = calcFormFieldsReports(entries);

    return reports;
  }

  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('generate-reports', 'form'),
  })
  @Get('forms/:id/entries/export')
  async exportFormEntries(
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: UUID,
    @Query() query: ExportFormEntriesParamsDto
  ): Promise<void> {
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
    });

    const entries = records.map((record) => new FormEntryEntity(record));

    const { columns, rows } = await serializeFormEntries(
      entries,
      this.prismaService
    );

    const tmp = tmpNameSync({ postfix: '.csv' });

    const csvWriter = createObjectCsvWriter({
      encoding: 'latin1',
      path: tmp,
      header: columns,
    });

    await csvWriter.writeRecords(rows);

    res.download(tmp, () => tmp && unlinkSync(tmp));
  }
}

export default FormsStatsController;
