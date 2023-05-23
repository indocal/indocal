import { PrismaService } from 'nestjs-prisma';

import { UUID } from '@/common';

import {
  FormFieldAnswer,
  TableFormFieldAnswer,
  TableFormFieldColumnAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

import {
  serializeTextColumnAnswer,
  serializeTextAreaColumnAnswer,
  serializeNumberColumnAnswer,
  serializeDniColumnAnswer,
  serializePhoneColumnAnswer,
  serializeEmailColumnAnswer,
  serializeCheckboxColumnAnswer,
  serializeSelectColumnAnswer,
  serializeRadioColumnAnswer,
  serializeTimeColumnAnswer,
  serializeDateColumnAnswer,
  serializeDateTimeColumnAnswer,
  serializeRatingColumnAnswer,
  serializeUsersColumnAnswer,
  serializeFilesColumnAnswer,
} from './utils';

export async function serializeTableFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>,
  client: PrismaService
): Promise<void> {
  const serializers: Record<
    TableFormFieldAnswer[number][number]['column']['type'],
    (
      answer: TableFormFieldColumnAnswer,
      client: PrismaService
    ) => SerializedAnswer | Promise<SerializedAnswer>
  > = {
    TEXT: serializeTextColumnAnswer,
    TEXTAREA: serializeTextAreaColumnAnswer,
    NUMBER: serializeNumberColumnAnswer,

    DNI: serializeDniColumnAnswer,
    PHONE: serializePhoneColumnAnswer,
    EMAIL: serializeEmailColumnAnswer,

    CHECKBOX: serializeCheckboxColumnAnswer,
    SELECT: serializeSelectColumnAnswer,
    RADIO: serializeRadioColumnAnswer,

    TIME: serializeTimeColumnAnswer,
    DATE: serializeDateColumnAnswer,
    DATETIME: serializeDateTimeColumnAnswer,

    RATING: serializeRatingColumnAnswer,

    FILES: serializeFilesColumnAnswer,

    USERS: serializeUsersColumnAnswer,
  };

  const content = answer.content as TableFormFieldAnswer;

  for await (const row of content) {
    for await (const answer of row) {
      const serialized = await serializers[answer.column.type](answer, client);

      const prev = map.get(answer.column.id);

      map.set(
        answer.column.id,
        prev ? [prev, serialized].join(', ') : serialized
      );
    }
  }
}

export default serializeTableFormFieldAnswer;
