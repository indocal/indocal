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

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';

import FormsService from './forms.service';
import { FormEntity } from './entities';
import {
  FindManyFormsParamsDto,
  CountFormsParamsDto,
  CreateFormDto,
  UpdateFormDto,
} from './dto';

import { FormsFieldsService } from './submodules';

@Controller('forms')
@UseGuards(PoliciesGuard)
export class FormsController {
  constructor(
    private formsService: FormsService,
    private formsFieldsService: FormsFieldsService
  ) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'form'))
  async create(@Body() createFormDto: CreateFormDto): Promise<FormEntity> {
    const form = await this.formsService.create(createFormDto);
    const fields = await this.formsFieldsService.findAll(form);

    return new FormEntity(form, fields);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'form'))
  async count(@Query() query: CountFormsParamsDto): Promise<number> {
    return await this.formsService.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'form'))
  async findMany(
    @Query() query: FindManyFormsParamsDto
  ): Promise<FormEntity[]> {
    const forms = await this.formsService.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
    });

    return await Promise.all(
      forms.map(async (form) => {
        const fields = await this.formsFieldsService.findAll(form);

        return new FormEntity(form, fields);
      })
    );
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'form'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<FormEntity | null> {
    const form = await this.formsService.findUnique('id', id);
    const fields = await this.formsFieldsService.findAll(id);

    return form ? new FormEntity(form, fields) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'form'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateFormDto: UpdateFormDto
  ): Promise<FormEntity> {
    const form = await this.formsService.update(id, updateFormDto);
    const fields = await this.formsFieldsService.findAll(form);

    return new FormEntity(form, fields);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'form'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<FormEntity> {
    const form = await this.formsService.delete(id);
    const fields = await this.formsFieldsService.findAll(form);

    return new FormEntity(form, fields);
  }
}

export default FormsController;
