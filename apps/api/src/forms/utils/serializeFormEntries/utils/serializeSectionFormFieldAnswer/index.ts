import { PrismaService } from 'nestjs-prisma';

import { UUID } from '@/common';

import {
  FormFieldAnswer,
  SectionFormFieldAnswer,
  SectionFormFieldItemAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

import {
  serializeTextItemAnswer,
  serializeTextAreaItemAnswer,
  serializeNumberItemAnswer,
  serializeDniItemAnswer,
  serializePhoneItemAnswer,
  serializeEmailItemAnswer,
  serializeCheckboxItemAnswer,
  serializeSelectItemAnswer,
  serializeRadioItemAnswer,
  serializeTimeItemAnswer,
  serializeDateItemAnswer,
  serializeDateTimeItemAnswer,
  serializeRatingItemAnswer,
  serializeNetPromoterScoreItemAnswer,
  serializeUsersItemAnswer,
  serializeFilesItemAnswer,
} from './utils';

export async function serializeSectionFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>,
  client: PrismaService
): Promise<void> {
  const serializers: Record<
    SectionFormFieldAnswer[number]['item']['type'],
    (
      answer: SectionFormFieldItemAnswer,
      client: PrismaService
    ) => SerializedAnswer | Promise<SerializedAnswer>
  > = {
    TEXT: serializeTextItemAnswer,
    TEXTAREA: serializeTextAreaItemAnswer,
    NUMBER: serializeNumberItemAnswer,

    DNI: serializeDniItemAnswer,
    PHONE: serializePhoneItemAnswer,
    EMAIL: serializeEmailItemAnswer,

    CHECKBOX: serializeCheckboxItemAnswer,
    SELECT: serializeSelectItemAnswer,
    RADIO: serializeRadioItemAnswer,

    TIME: serializeTimeItemAnswer,
    DATE: serializeDateItemAnswer,
    DATETIME: serializeDateTimeItemAnswer,

    RATING: serializeRatingItemAnswer,
    NET_PROMOTER_SCORE: serializeNetPromoterScoreItemAnswer,

    FILES: serializeFilesItemAnswer,

    USERS: serializeUsersItemAnswer,
  };

  const content = answer.content as SectionFormFieldAnswer;

  for await (const answer of content) {
    const serialized = await serializers[answer.item.type](answer, client);

    map.set(answer.item.id, serialized);
  }
}

export default serializeSectionFormFieldAnswer;
