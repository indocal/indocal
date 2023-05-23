import { UUID } from '@/common';

import {
  FormFieldAnswer,
  SectionFormFieldItemAnswer,
  TableFormFieldColumnAnswer,
} from '../submodules/entries/entities';

export type FormFieldReport = {
  field: FormFieldAnswer['field'];
  content:
    | TextFormFieldReport
    | TextAreaFormFieldReport
    | NumberFormFieldReport
    | DniFormFieldReport
    | PhoneFormFieldReport
    | EmailFormFieldReport
    | CheckboxFormFieldReport
    | SelectFormFieldReport
    | RadioFormFieldReport
    | TimeFormFieldReport
    | DateFormFieldReport
    | DateTimeFormFieldReport
    | RatingFormFieldReport
    | NetPromoterScoreFormFieldReport
    | FilesFormFieldReport
    | UsersFormFieldReport
    | SectionFormFieldReport
    | TableFormFieldReport;
};

export default FormFieldReport;

////////////////////
// Report by type //
////////////////////

export type TextFormFieldReport = {
  count: number;
  na: number;
  lastAnswers: string[];
};

export type TextAreaFormFieldReport = {
  count: number;
  na: number;
  lastAnswers: string[];
};

export type NumberFormFieldReport = {
  count: number;
  na: number;
  lastAnswers: number[];
};

export type DniFormFieldReport = {
  count: number;
  na: number;
  lastAnswers: string[];
};

export type PhoneFormFieldReport = {
  count: number;
  na: number;
  lastAnswers: string[];
};

export type EmailFormFieldReport = {
  count: number;
  na: number;
  lastAnswers: string[];
};

export type CheckboxFormFieldReport = {
  yes: number;
  no: number;
  na: number;
};

export type SelectFormFieldReport = Record<string, number>;

export type RadioFormFieldReport = Record<string, number>;

export type TimeFormFieldReport = {
  count: number;
  na: number;
  lastAnswers: string[];
};

export type DateFormFieldReport = {
  count: number;
  na: number;
  lastAnswers: string[];
};

export type DateTimeFormFieldReport = {
  count: number;
  na: number;
  lastAnswers: string[];
};

export type RatingFormFieldReport = {
  count: number;
  na: number;
  average: number;
};

export type NetPromoterScoreFormFieldReport = {
  positive: number;
  neutral: number;
  negative: number;
  na: number;
};

export type FilesFormFieldReport = {
  count: number;
  na: number;
  lastAnswers: UUID[];
};

export type UsersFormFieldReport = {
  count: number;
  na: number;
  lastAnswers: UUID[];
};

export type SectionFormFieldReport = SectionFormFieldItemReport[];

export type SectionFormFieldItemReport = {
  item: SectionFormFieldItemAnswer['item'];
  content:
    | TextFormFieldReport
    | TextAreaFormFieldReport
    | NumberFormFieldReport
    | DniFormFieldReport
    | PhoneFormFieldReport
    | EmailFormFieldReport
    | CheckboxFormFieldReport
    | SelectFormFieldReport
    | RadioFormFieldReport
    | TimeFormFieldReport
    | DateFormFieldReport
    | DateTimeFormFieldReport
    | RatingFormFieldReport
    | NetPromoterScoreFormFieldReport
    | FilesFormFieldReport
    | UsersFormFieldReport;
};

export type TableFormFieldReport = TableFormFieldColumnReport[];

export type TableFormFieldColumnReport = {
  column: TableFormFieldColumnAnswer['column'];
  content:
    | TextFormFieldReport
    | TextAreaFormFieldReport
    | NumberFormFieldReport
    | DniFormFieldReport
    | PhoneFormFieldReport
    | EmailFormFieldReport
    | CheckboxFormFieldReport
    | SelectFormFieldReport
    | RadioFormFieldReport
    | TimeFormFieldReport
    | DateFormFieldReport
    | DateTimeFormFieldReport
    | RatingFormFieldReport
    | FilesFormFieldReport
    | UsersFormFieldReport;
};
