import { Injectable } from '@nestjs/common';
import { Prisma, FormEntry as DBFormEntryModel } from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateFormEntryDto } from './dto';

@Injectable()
export class FormsEntriesService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createFormEntryDto: CreateFormEntryDto
  ): Promise<DBFormEntryModel> {
    return await this.prismaService.formEntry.create({
      data: {
        answers: createFormEntryDto.answers as object,
        form: { connect: { id: createFormEntryDto.form } },
        ...(createFormEntryDto.answeredBy && {
          answeredBy: { connect: { id: createFormEntryDto.answeredBy } },
        }),
      },
    });
  }

  async count(params: Prisma.FormEntryCountArgs): Promise<number> {
    return await this.prismaService.formEntry.count(params);
  }

  async findMany(
    params: Prisma.FormEntryFindManyArgs
  ): Promise<DBFormEntryModel[]> {
    return await this.prismaService.formEntry.findMany(params);
  }

  async findUnique(
    input: Prisma.FormEntryWhereUniqueInput
  ): Promise<DBFormEntryModel | null> {
    return await this.prismaService.formEntry.findUnique({ where: input });
  }

  async delete(id: UUID): Promise<DBFormEntryModel> {
    return await this.prismaService.formEntry.delete({ where: { id } });
  }
}

export default FormsEntriesService;
