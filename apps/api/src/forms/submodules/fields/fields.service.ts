import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Form as DBFormModel,
  FormField as DBFormFieldModel,
} from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateFormFieldDto, UpdateFormFieldDto } from './dto';

@Injectable()
export class FormsFieldsService {
  constructor(private prismaService: PrismaService) {}

  async create(
    form: UUID | DBFormModel,
    createFormFieldDto: CreateFormFieldDto
  ): Promise<DBFormFieldModel> {
    const fields = await this.prismaService.formField.findMany({
      where: { form: { id: typeof form === 'string' ? form : form.id } },
      orderBy: { order: 'asc' },
    });

    const lastField = fields.pop();

    return await this.prismaService.formField.create({
      data: {
        type: createFormFieldDto.type,
        title: createFormFieldDto.title,
        description: createFormFieldDto.description,
        order: lastField ? lastField.order + 1 : 1,
        form: {
          connect: {
            id: typeof form === 'string' ? form : form.id,
          },
        },
      },
    });
  }

  async count(form: UUID | DBFormModel): Promise<number> {
    return await this.prismaService.formField.count({
      where: {
        form: {
          id: typeof form === 'string' ? form : form.id,
        },
      },
    });
  }

  async findAll(form: UUID | DBFormModel): Promise<DBFormFieldModel[]> {
    return await this.prismaService.formField.findMany({
      where: {
        form: {
          id: typeof form === 'string' ? form : form.id,
        },
      },
    });
  }

  async findUnique(
    identifier: keyof Prisma.FormFieldWhereUniqueInput,
    input: string
  ): Promise<DBFormFieldModel | null> {
    return await this.prismaService.formField.findUnique({
      where: { [identifier]: input },
    });
  }

  async update(
    id: UUID,
    updateFormFieldDto: UpdateFormFieldDto
  ): Promise<DBFormFieldModel> {
    return await this.prismaService.formField.update({
      where: { id },
      data: {
        title: updateFormFieldDto.title,
        description: updateFormFieldDto.description,
        config: updateFormFieldDto.config,
      },
    });
  }

  async delete(id: UUID): Promise<DBFormFieldModel> {
    return await this.prismaService.formField.delete({
      where: { id },
    });
  }
}

export default FormsFieldsService;
