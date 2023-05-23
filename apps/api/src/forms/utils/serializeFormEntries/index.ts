import { PrismaService } from 'nestjs-prisma';

import { UUID } from '@/common';

import { FormEntryEntity } from '../../submodules/entries/entities';

import {
  getColumns,
  serializeTextFormFieldAnswer,
  serializeTextAreaFormFieldAnswer,
  serializeNumberFormFieldAnswer,
  serializeDniFormFieldAnswer,
  serializePhoneFormFieldAnswer,
  serializeEmailFormFieldAnswer,
  serializeCheckboxFormFieldAnswer,
  serializeSelectFormFieldAnswer,
  serializeRadioFormFieldAnswer,
  serializeTimeFormFieldAnswer,
  serializeDateFormFieldAnswer,
  serializeDateTimeFormFieldAnswer,
  serializeRatingFormFieldAnswer,
  serializeNetPromoterScoreFormFieldAnswer,
  serializeUsersFormFieldAnswer,
  serializeFilesFormFieldAnswer,
  serializeSectionFormFieldAnswer,
  serializeTableFormFieldAnswer,
} from './utils';
import { SerializedAnswer, Column, Row } from './types';

export type SerializeFormEntriesReturn = {
  columns: Column[];
  rows: Row[];
};

export async function serializeFormEntries(
  records: FormEntryEntity[],
  client: PrismaService
): Promise<SerializeFormEntriesReturn> {
  const serializers = {
    TEXT: serializeTextFormFieldAnswer,
    TEXTAREA: serializeTextAreaFormFieldAnswer,
    NUMBER: serializeNumberFormFieldAnswer,

    DNI: serializeDniFormFieldAnswer,
    PHONE: serializePhoneFormFieldAnswer,
    EMAIL: serializeEmailFormFieldAnswer,

    CHECKBOX: serializeCheckboxFormFieldAnswer,
    SELECT: serializeSelectFormFieldAnswer,
    RADIO: serializeRadioFormFieldAnswer,

    TIME: serializeTimeFormFieldAnswer,
    DATE: serializeDateFormFieldAnswer,
    DATETIME: serializeDateTimeFormFieldAnswer,

    RATING: serializeRatingFormFieldAnswer,
    NET_PROMOTER_SCORE: serializeNetPromoterScoreFormFieldAnswer,

    FILES: serializeFilesFormFieldAnswer,

    USERS: serializeUsersFormFieldAnswer,

    SECTION: serializeSectionFormFieldAnswer,
    TABLE: serializeTableFormFieldAnswer,
  };

  const columns = getColumns(records);

  const promises = records.map(async (record) => {
    const map: Map<UUID, SerializedAnswer> = new Map();

    for await (const answer of record.answers) {
      await serializers[answer.field.type](answer, map, client);
    }

    columns.forEach((column) => {
      if (!map.has(column.id)) {
        map.set(column.id, 'N/A');
      }
    });

    return Object.fromEntries(map);
  });

  const rows = await Promise.all(promises);

  return { columns, rows };
}
