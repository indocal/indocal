import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FormField, Form } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { PrismaService } from '@/prisma';

import { FormEntity } from '../../entities';

import { FormFieldEntity } from './entities';
import { CreateFormFieldDto, UpdateFormFieldDto } from './dto';

class EnhancedFormField extends FormFieldEntity {
  form: FormEntity;
}

type CreateEnhancedFormField = FormField & {
  form: Form;
};

@Controller()
@UseGuards(PoliciesGuard)
export class FormsFieldsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedFormField({
    form,
    ...rest
  }: CreateEnhancedFormField): EnhancedFormField {
    const field = new EnhancedFormField(rest);
    field.form = new FormEntity(form);

    return field;
  }

  @Post('forms/:form_id/fields')
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'formField'))
  async create(
    @Param('form_id') formId: UUID,
    @Body() createFieldDto: CreateFormFieldDto
  ): Promise<SingleEntityResponse<EnhancedFormField>> {
    const field = await this.prismaService.formField.create({
      data: {
        type: createFieldDto.type,
        title: createFieldDto.title,
        description: createFieldDto.description,
        form: { connect: { id: formId } },
      },
      include: { form: true },
    });

    return this.createEnhancedFormField(field);
  }

  @Get('forms/:form_id/fields/count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'formField'))
  async count(@Param('form_id') formId: UUID): Promise<number> {
    return await this.prismaService.formField.count({
      where: { form: { id: formId } },
    });
  }

  @Get('forms/:form_id/fields')
  @CheckPolicies((ability) => ability.can(Action.READ, 'formField'))
  async findAll(
    @Param('form_id') formId: UUID
  ): Promise<MultipleEntitiesResponse<EnhancedFormField>> {
    const [fields, count] = await this.prismaService.$transaction([
      this.prismaService.formField.findMany({
        where: { form: { id: formId } },
        include: { form: true },
      }),
      this.prismaService.formField.count({
        where: { form: { id: formId } },
      }),
    ]);

    return {
      count,
      entities: fields.map((field) => this.createEnhancedFormField(field)),
    };
  }

  @Get('forms/fields/:id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'formField'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedFormField | null>> {
    const field = await this.prismaService.formField.findUnique({
      where: { id },
      include: { form: true },
    });

    return field ? this.createEnhancedFormField(field) : null;
  }

  @Patch('forms/fields/:id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'formField'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateFieldDto: UpdateFormFieldDto
  ): Promise<SingleEntityResponse<EnhancedFormField>> {
    const field = await this.prismaService.formField.update({
      where: { id },
      data: {
        title: updateFieldDto.title,
        description: updateFieldDto.description,
        config: updateFieldDto.config,
      },
      include: { form: true },
    });

    return this.createEnhancedFormField(field);
  }

  @Delete('forms/fields/:id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'formField'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedFormField>> {
    const field = await this.prismaService.formField.delete({
      where: { id },
      include: { form: true },
    });

    return this.createEnhancedFormField(field);
  }
}

export default FormsFieldsController;
