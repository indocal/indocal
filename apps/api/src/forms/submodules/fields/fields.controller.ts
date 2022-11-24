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

import FormsFieldsService from './fields.service';
import { FormFieldEntity } from './entities';
import { CreateFormFieldDto, UpdateFormFieldDto } from './dto';

@Controller()
@UseGuards(PoliciesGuard)
export class FormsFieldsController {
  constructor(private formsfieldsService: FormsFieldsService) {}

  @Post('forms/:form_id/fields')
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'formField'))
  async create(
    @Param('form_id') formId: UUID,
    @Body() createFieldDto: CreateFormFieldDto
  ): Promise<FormFieldEntity> {
    const field = await this.formsfieldsService.create(formId, createFieldDto);

    return new FormFieldEntity(field);
  }

  @Get('forms/:form_id/fields/count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'formField'))
  async count(@Param('form_id') formId: UUID): Promise<number> {
    return await this.formsfieldsService.count(formId);
  }

  @Get('forms/:form_id/fields')
  @CheckPolicies((ability) => ability.can(Action.READ, 'formField'))
  async findAll(@Param('form_id') formId: UUID): Promise<FormFieldEntity[]> {
    const fields = await this.formsfieldsService.findAll(formId);

    return fields.map((field) => new FormFieldEntity(field));
  }

  @Get('forms/fields/:id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'formField'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<FormFieldEntity | null> {
    const field = await this.formsfieldsService.findUnique({ id });

    return field ? new FormFieldEntity(field) : null;
  }

  @Patch('forms/fields/:id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'formField'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateFieldDto: UpdateFormFieldDto
  ): Promise<FormFieldEntity> {
    const field = await this.formsfieldsService.update(id, updateFieldDto);

    return new FormFieldEntity(field);
  }

  @Delete('forms/fields/:id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'formField'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<FormFieldEntity> {
    const field = await this.formsfieldsService.delete(id);

    return new FormFieldEntity(field);
  }
}

export default FormsFieldsController;
