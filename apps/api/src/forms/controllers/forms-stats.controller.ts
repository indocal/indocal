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

import {
  calcTextFormFieldReport,
  calcTextAreaFormFieldReport,
  calcNumberFormFieldReport,
  calcDniFormFieldReport,
  calcPhoneFormFieldReport,
  calcEmailFormFieldReport,
  calcCheckboxFormFieldReport,
  calcSelectFormFieldReport,
  calcRadioFormFieldReport,
  calcTimeFormFieldReport,
  calcDateFormFieldReport,
  calcDateTimeFormFieldReport,
  calcRatingFormFieldReport,
  calcNetPromoterScoreFormFieldReport,
  calcUsersFormFieldReport,
  calcFilesFormFieldReport,
  calcSectionFormFieldReport,
  calcTableFormFieldReport,
} from '../utils';
import {
  CalcFormEntriesPerMonthParamsDto,
  CalcFormFieldsReportsParamsDto,
} from '../dto';
import { FormEntriesPerMonth, FormFieldReport } from '../types';

import {
  FormEntryEntity,
  FormFieldAnswer,
} from '../submodules/entries/entities';

@Controller()
@UseGuards(PoliciesGuard)
export class FormsStatsController {
  constructor(private prismaService: PrismaService) {}

  @Get('forms/:id/stats/entries-per-month')
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
      select: { createdAt: true },
    });

    const entriesPerMonth: FormEntriesPerMonth[] = [];

    for (let i = 0; i < 12; i++) {
      const year = startOfYear(new Date());

      year.setMonth(i);

      const month = year.getMonth();

      const entries = records.filter(
        (record) => record.createdAt.getMonth() === month
      );

      entriesPerMonth.push({
        month: year.toLocaleString('es-do', { month: 'short' }),
        count: entries.length,
      });
    }

    return entriesPerMonth;
  }

  @Get('forms/:id/stats/fields-reports')
  @CheckPolicies((ability) => ability.can('generate-reports', 'form'))
  async generateFormFieldsReports(
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

    const map: Map<UUID, FormFieldReport> = new Map();

    const helpers: Record<
      FormFieldAnswer['field']['type'],
      (answer: FormFieldAnswer, map: Map<string, FormFieldReport>) => void
    > = {
      TEXT: calcTextFormFieldReport,
      TEXTAREA: calcTextAreaFormFieldReport,
      NUMBER: calcNumberFormFieldReport,

      DNI: calcDniFormFieldReport,
      PHONE: calcPhoneFormFieldReport,
      EMAIL: calcEmailFormFieldReport,

      CHECKBOX: calcCheckboxFormFieldReport,
      SELECT: calcSelectFormFieldReport,
      RADIO: calcRadioFormFieldReport,

      TIME: calcTimeFormFieldReport,
      DATE: calcDateFormFieldReport,
      DATETIME: calcDateTimeFormFieldReport,

      RATING: calcRatingFormFieldReport,
      NET_PROMOTER_SCORE: calcNetPromoterScoreFormFieldReport,

      FILES: calcFilesFormFieldReport,

      USERS: calcUsersFormFieldReport,

      SECTION: calcSectionFormFieldReport,
      TABLE: calcTableFormFieldReport,
    };

    entries.forEach((entry) => {
      entry.answers.forEach((answer) => {
        helpers[answer.field.type](answer, map);
      });
    });

    return Array.from(map.values());
  }
}

export default FormsStatsController;
