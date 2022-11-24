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
import {
  PoliciesGuard,
  CheckPolicies,
  Action,
  UsersGroupsService,
} from '@/auth';

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
    private formsFieldsService: FormsFieldsService,
    private usersGroupsService: UsersGroupsService
  ) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'form'))
  async create(@Body() createFormDto: CreateFormDto): Promise<FormEntity> {
    const form = await this.formsService.create(createFormDto);

    const [fields, groups] = await Promise.all([
      this.formsFieldsService.findAll(form),
      this.usersGroupsService.findMany({
        where: { forms: { some: { id: form.id } } },
      }),
    ]);

    return new FormEntity(form, { fields, group: groups.pop() });
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
        const [fields, groups] = await Promise.all([
          this.formsFieldsService.findAll(form),
          this.usersGroupsService.findMany({
            where: { forms: { some: { id: form.id } } },
          }),
        ]);

        return new FormEntity(form, { fields, group: groups.pop() });
      })
    );
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'form'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<FormEntity | null> {
    const form = await this.formsService.findUnique({ id });

    const [fields, groups] = await Promise.all([
      this.formsFieldsService.findAll(id),
      this.usersGroupsService.findMany({ where: { forms: { some: { id } } } }),
    ]);

    return form ? new FormEntity(form, { fields, group: groups.pop() }) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'form'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateFormDto: UpdateFormDto
  ): Promise<FormEntity> {
    const form = await this.formsService.update(id, updateFormDto);

    const [fields, groups] = await Promise.all([
      this.formsFieldsService.findAll(form),
      this.usersGroupsService.findMany({
        where: { forms: { some: { id: form.id } } },
      }),
    ]);

    return new FormEntity(form, { fields, group: groups.pop() });
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'form'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<FormEntity> {
    const form = await this.formsService.delete(id);

    const [fields, groups] = await Promise.all([
      this.formsFieldsService.findAll(form),
      this.usersGroupsService.findMany({
        where: { forms: { some: { id: form.id } } },
      }),
    ]);

    return new FormEntity(form, { fields, group: groups.pop() });
  }
}

export default FormsController;
