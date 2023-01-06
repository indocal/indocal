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

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { FormEntity } from '@/forms';
import { PrismaService } from '@/prisma';

import { FormFieldEntity } from './entities';
import { CreateFormFieldDto, UpdateFormFieldDto } from './dto';

class EnhancedFormField extends FormFieldEntity {
  form: FormEntity;
}

@Controller()
@UseGuards(PoliciesGuard)
export class FormsFieldsController {
  constructor(private prismaService: PrismaService) {}

  @Post('forms/:form_id/fields')
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'formField'))
  async create(
    @Param('form_id') formId: UUID,
    @Body() createFieldDto: CreateFormFieldDto
  ): Promise<EnhancedFormField> {
    const { form, ...rest } = await this.prismaService.formField.create({
      data: {
        type: createFieldDto.type,
        title: createFieldDto.title,
        description: createFieldDto.description,
        form: { connect: { id: formId } },
      },
      include: { form: true },
    });

    const field = new EnhancedFormField(rest);
    field.form = new FormEntity(form);

    return field;
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
  async findAll(@Param('form_id') formId: UUID): Promise<EnhancedFormField[]> {
    const fields = await this.prismaService.formField.findMany({
      where: { form: { id: formId } },
      include: { form: true },
    });

    return fields.map(({ form, ...rest }) => {
      const field = new EnhancedFormField(rest);
      field.form = new FormEntity(form);

      return field;
    });
  }

  @Get('forms/fields/:id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'formField'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<EnhancedFormField | null> {
    const response = await this.prismaService.formField.findUnique({
      where: { id },
      include: { form: true },
    });

    if (response) {
      const { form, ...rest } = response;

      const field = new EnhancedFormField(rest);
      field.form = new FormEntity(form);

      return field;
    }

    return null;
  }

  @Patch('forms/fields/:id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'formField'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateFieldDto: UpdateFormFieldDto
  ): Promise<EnhancedFormField> {
    const { form, ...rest } = await this.prismaService.formField.update({
      where: { id },
      data: {
        title: updateFieldDto.title,
        description: updateFieldDto.description,
        config: updateFieldDto.config,
      },
      include: { form: true },
    });

    const field = new EnhancedFormField(rest);
    field.form = new FormEntity(form);

    return field;
  }

  @Delete('forms/fields/:id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'formField'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<EnhancedFormField> {
    const { form, ...rest } = await this.prismaService.formField.delete({
      where: { id },
      include: { form: true },
    });

    const field = new EnhancedFormField(rest);
    field.form = new FormEntity(form);

    return field;
  }
}

export default FormsFieldsController;
