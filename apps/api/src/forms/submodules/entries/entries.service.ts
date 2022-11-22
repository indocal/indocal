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
        answers: createFormEntryDto.answers,
        form: { connect: { id: createFormEntryDto.form } },
        sentBy: { connect: { id: createFormEntryDto.sentBy } },
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
    identifier: keyof Prisma.FormEntryWhereUniqueInput,
    input: string
  ): Promise<DBFormEntryModel | null> {
    return await this.prismaService.formEntry.findUnique({
      where: { [identifier]: input },
    });
  }

  async delete(id: UUID): Promise<DBFormEntryModel> {
    return await this.prismaService.formEntry.delete({ where: { id } });
  }
}

export default FormsEntriesService;
