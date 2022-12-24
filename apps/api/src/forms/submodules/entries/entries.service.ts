import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Prisma, FormEntry as DBFormEntryModel } from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { FormConfig } from '../../entities';

import { CreateFormEntryDto } from './dto';

@Injectable()
export class FormsEntriesService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService
  ) {}

  async create(
    createFormEntryDto: CreateFormEntryDto
  ): Promise<DBFormEntryModel> {
    const { form, ...entry } = await this.prismaService.formEntry.create({
      data: {
        answers: createFormEntryDto.answers,
        form: { connect: { id: createFormEntryDto.form } },
        ...(createFormEntryDto.answeredBy && {
          answeredBy: { connect: { id: createFormEntryDto.answeredBy } },
        }),
      },
      include: { form: true },
    });

    const config = form.config as FormConfig | null;

    const isThereAtLeastOneFieldIncluded = createFormEntryDto.answers.some(
      (answer) => answer.field.config?.webhook?.include
    );

    if (
      config?.webhooks &&
      config.webhooks.length > 0 &&
      isThereAtLeastOneFieldIncluded
    ) {
      const answers = createFormEntryDto.answers
        .filter((answer) => answer.field.config?.webhook?.include)
        .reduce(
          (prev, answer) => ({
            ...prev,
            [answer.field.config?.webhook?.key as string]: answer.content,
          }),
          {}
        );

      //  TODO: add loggger
      await Promise.allSettled(
        config.webhooks.map((webhook) =>
          this.httpService.axiosRef.post(webhook.url, answers)
        )
      );
    }

    return entry;
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
