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
import { Form, FormField, UserGroup } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { PrismaService } from '@/prisma';

import { FormFieldEntity } from './submodules/fields/entities';
import { UserGroupEntity } from '../auth/submodules/groups/entities';

import { FormEntity } from './entities';
import {
  FindManyFormsParamsDto,
  CountFormsParamsDto,
  CreateFormDto,
  UpdateFormDto,
} from './dto';

class EnhancedForm extends FormEntity {
  fields: FormFieldEntity[];
  group: UserGroupEntity;
}

type CreateEnhancedForm = Form & {
  fields: FormField[];
  group: UserGroup;
};

@Controller('forms')
@UseGuards(PoliciesGuard)
export class FormsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedForm({
    fields,
    group,
    ...rest
  }: CreateEnhancedForm): EnhancedForm {
    const form = new EnhancedForm(rest);
    form.fields = fields.map((field) => new FormFieldEntity(field));
    form.group = new UserGroupEntity(group);

    return form;
  }

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'form'))
  async create(
    @Body() createFormDto: CreateFormDto
  ): Promise<SingleEntityResponse<EnhancedForm>> {
    const form = await this.prismaService.form.create({
      data: {
        slug: createFormDto.slug,
        title: createFormDto.title,
        description: createFormDto.description,
        group: { connect: { id: createFormDto.group } },
      },
      include: { fields: true, group: true },
    });

    return this.createEnhancedForm(form);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'form'))
  async count(@Query() query: CountFormsParamsDto): Promise<number> {
    return await this.prismaService.form.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'form'))
  async findMany(
    @Query() query: FindManyFormsParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedForm>> {
    const [forms, count] = await this.prismaService.$transaction([
      this.prismaService.form.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { fields: true, group: true },
      }),
      this.prismaService.form.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: forms.map((form) => this.createEnhancedForm(form)),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'form'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedForm | null>> {
    const form = await this.prismaService.form.findUnique({
      where: { id },
      include: { fields: true, group: true },
    });

    return form ? this.createEnhancedForm(form) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'form'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateFormDto: UpdateFormDto
  ): Promise<SingleEntityResponse<EnhancedForm>> {
    const form = await this.prismaService.form.update({
      where: { id },
      data: {
        slug: updateFormDto.slug,
        title: updateFormDto.title,
        description: updateFormDto.description,
        status: updateFormDto.status,
        visibility: updateFormDto.visibility,
        config: updateFormDto.config,
        ...(updateFormDto.group && {
          group: { connect: { id: updateFormDto.group } },
        }),
      },
      include: { fields: true, group: true },
    });

    return this.createEnhancedForm(form);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'form'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedForm>> {
    const form = await this.prismaService.form.delete({
      where: { id },
      include: { fields: true, group: true },
    });

    return this.createEnhancedForm(form);
  }
}

export default FormsController;
