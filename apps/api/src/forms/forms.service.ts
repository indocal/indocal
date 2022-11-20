import { Injectable } from '@nestjs/common';
import { Prisma, Form as DBFormModel } from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateFormDto, UpdateFormDto } from './dto';

@Injectable()
export class FormsService {
  constructor(private prismaService: PrismaService) {}

  async create(createFormDto: CreateFormDto): Promise<DBFormModel> {
    return await this.prismaService.form.create({
      data: {
        slug: createFormDto.slug,
        title: createFormDto.title,
        description: createFormDto.description,
        group: { connect: { id: createFormDto.group } },
      },
    });
  }

  async count(params: Prisma.FormCountArgs): Promise<number> {
    return await this.prismaService.form.count(params);
  }

  async findMany(params: Prisma.FormFindManyArgs): Promise<DBFormModel[]> {
    return await this.prismaService.form.findMany(params);
  }

  async findUnique(
    identifier: keyof Prisma.FormWhereUniqueInput,
    input: string
  ): Promise<DBFormModel | null> {
    return await this.prismaService.form.findUnique({
      where: { [identifier]: input },
    });
  }

  async update(id: UUID, updateFormDto: UpdateFormDto): Promise<DBFormModel> {
    return await this.prismaService.form.update({
      where: { id },
      data: {
        slug: updateFormDto.slug,
        title: updateFormDto.title,
        description: updateFormDto.description,
        status: updateFormDto.status,
        visibility: updateFormDto.visibility,
        group: { connect: { id: updateFormDto.group } },
      },
    });
  }

  async delete(id: UUID): Promise<DBFormModel> {
    return await this.prismaService.form.delete({ where: { id } });
  }
}

export default FormsService;
