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

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies, Action, UsersService } from '@/auth';

import FormsService from '../../forms.service';

import FormsEntriesService from './entries.service';
import { FormEntryEntity } from './entities';
import {
  FindManyFormsEntriesParamsDto,
  CountFormsEntriesParamsDto,
  CreateFormEntryDto,
} from './dto';

@Controller('entries')
@UseGuards(PoliciesGuard)
export class FormsEntriesController {
  constructor(
    private formsEntriesService: FormsEntriesService,
    private formsService: FormsService,
    private usersService: UsersService
  ) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'formEntry'))
  async create(
    @Body() createFormEntryDto: CreateFormEntryDto
  ): Promise<FormEntryEntity> {
    const formEntry = await this.formsEntriesService.create(createFormEntryDto);

    const form = await this.formsService.findUnique({
      id: formEntry.formId,
    });

    if (formEntry.answeredById) {
      const answeredBy = await this.usersService.findUnique({
        id: formEntry.answeredById,
      });

      return new FormEntryEntity(formEntry, {
        ...(form && { form }),
        ...(answeredBy && { answeredBy }),
      });
    }

    return new FormEntryEntity(formEntry, {
      ...(form && { form }),
    });
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'formEntry'))
  async count(@Query() query: CountFormsEntriesParamsDto): Promise<number> {
    return await this.formsEntriesService.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'formEntry'))
  async findMany(
    @Query() query: FindManyFormsEntriesParamsDto
  ): Promise<FormEntryEntity[]> {
    const forms = await this.formsEntriesService.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
    });

    return await Promise.all(
      forms.map(async (formEntry) => {
        const form = await this.formsService.findUnique({
          id: formEntry.formId,
        });

        if (formEntry.answeredById) {
          const answeredBy = await this.usersService.findUnique({
            id: formEntry.answeredById,
          });

          return new FormEntryEntity(formEntry, {
            ...(form && { form }),
            ...(answeredBy && { answeredBy }),
          });
        }

        return new FormEntryEntity(formEntry, {
          ...(form && { form }),
        });
      })
    );
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'formEntry'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<FormEntryEntity | null> {
    const formEntry = await this.formsEntriesService.findUnique({ id });

    if (!formEntry) return null;

    const form = await this.formsService.findUnique({
      id: formEntry.formId,
    });

    if (formEntry.answeredById) {
      const answeredBy = await this.usersService.findUnique({
        id: formEntry.answeredById,
      });

      return new FormEntryEntity(formEntry, {
        ...(form && { form }),
        ...(answeredBy && { answeredBy }),
      });
    }

    return new FormEntryEntity(formEntry, {
      ...(form && { form }),
    });
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'formEntry'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<FormEntryEntity> {
    const formEntry = await this.formsEntriesService.delete(id);

    const form = await this.formsService.findUnique({
      id: formEntry.formId,
    });

    if (formEntry.answeredById) {
      const answeredBy = await this.usersService.findUnique({
        id: formEntry.answeredById,
      });

      return new FormEntryEntity(formEntry, {
        ...(form && { form }),
        ...(answeredBy && { answeredBy }),
      });
    }

    return new FormEntryEntity(formEntry, {
      ...(form && { form }),
    });
  }
}

export default FormsEntriesController;
