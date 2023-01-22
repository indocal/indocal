import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FormEntry, User, Form } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { PrismaService } from '@/prisma';

import { UserEntity } from '../../../auth/submodules/users/entities';
import { FormEntity } from '../../entities';

import { FormEntryEntity } from './entities';
import {
  FindManyFormsEntriesParamsDto,
  CountFormsEntriesParamsDto,
  CreateFormEntryDto,
} from './dto';

class EnhancedFormEntry extends FormEntryEntity {
  answeredBy: UserEntity | null;
  form: FormEntity;
}

type CreateEnhancedFormEntry = FormEntry & {
  answeredBy: User | null;
  form: Form;
};

@Controller('entries')
@UseGuards(PoliciesGuard)
export class FormsEntriesController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedFormEntry({
    form,
    answeredBy,
    ...rest
  }: CreateEnhancedFormEntry): EnhancedFormEntry {
    const entry = new EnhancedFormEntry(rest);
    entry.answeredBy = answeredBy ? new UserEntity(answeredBy) : null;
    entry.form = new FormEntity(form);

    return entry;
  }

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'formEntry'))
  async create(
    @Body() createEntryDto: CreateFormEntryDto
  ): Promise<SingleEntityResponse<EnhancedFormEntry>> {
    const entry = await this.prismaService.formEntry.create({
      data: {
        answers: createEntryDto.answers,
        form: { connect: { id: createEntryDto.form } },
        ...(createEntryDto.answeredBy && {
          answeredBy: { connect: { id: createEntryDto.answeredBy } },
        }),
      },
      include: { answeredBy: true, form: true },
    });

    return this.createEnhancedFormEntry(entry);
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
        include: { answeredBy: true, form: true },
      }),
      this.prismaService.formEntry.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: entries.map((entry) => this.createEnhancedFormEntry(entry)),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'formEntry'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedFormEntry | null>> {
    const entry = await this.prismaService.formEntry.findUnique({
      where: { id },
      include: { answeredBy: true, form: true },
    });

    return entry ? this.createEnhancedFormEntry(entry) : null;
  }
}

export default FormsEntriesController;
