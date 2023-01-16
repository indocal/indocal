import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies, Action, UserEntity } from '@/auth';
import { FormEntity } from '@/forms';
import { PrismaService } from '@/prisma';

import { FormEntryEntity } from './entities';
import {
  FindManyFormsEntriesParamsDto,
  CountFormsEntriesParamsDto,
  CreateFormEntryDto,
} from './dto';

class EnhancedFormEntry extends FormEntryEntity {
  form: FormEntity;
  answeredBy: UserEntity | null;
}

@Controller('entries')
@UseGuards(PoliciesGuard)
export class FormsEntriesController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'formEntry'))
  async create(
    @Body() createEntryDto: CreateFormEntryDto
  ): Promise<SingleEntityResponse<EnhancedFormEntry>> {
    const { form, answeredBy, ...rest } =
      await this.prismaService.formEntry.create({
        data: {
          answers: createEntryDto.answers,
          form: { connect: { id: createEntryDto.form } },
          ...(createEntryDto.answeredBy && {
            answeredBy: { connect: { id: createEntryDto.answeredBy } },
          }),
        },
        include: { form: true, answeredBy: true },
      });

    const entry = new EnhancedFormEntry(rest);
    entry.form = new FormEntity(form);
    entry.answeredBy = answeredBy ? new UserEntity(answeredBy) : null;

    return entry;
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'formEntry'))
  async count(@Query() query: CountFormsEntriesParamsDto): Promise<number> {
    return await this.prismaService.formEntry.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'formEntry'))
  async findMany(
    @Query() query: FindManyFormsEntriesParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedFormEntry>> {
    const [entries, count] = await this.prismaService.$transaction([
      this.prismaService.formEntry.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { form: true, answeredBy: true },
      }),
      this.prismaService.formEntry.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: entries.map(({ form, answeredBy, ...rest }) => {
        const entry = new EnhancedFormEntry(rest);
        entry.form = new FormEntity(form);
        entry.answeredBy = answeredBy ? new UserEntity(answeredBy) : null;

        return entry;
      }),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'formEntry'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedFormEntry | null>> {
    const response = await this.prismaService.formEntry.findUnique({
      where: { id },
      include: { form: true, answeredBy: true },
    });

    if (!response) return null;

    const { form, answeredBy, ...rest } = response;

    const entry = new EnhancedFormEntry(rest);
    entry.form = new FormEntity(form);
    entry.answeredBy = answeredBy ? new UserEntity(answeredBy) : null;

    return entry;
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'formEntry'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedFormEntry>> {
    const { form, answeredBy, ...rest } =
      await this.prismaService.formEntry.delete({
        where: { id },
        include: { form: true, answeredBy: true },
      });

    const entry = new EnhancedFormEntry(rest);
    entry.form = new FormEntity(form);
    entry.answeredBy = answeredBy ? new UserEntity(answeredBy) : null;

    return entry;
  }
}

export default FormsEntriesController;
