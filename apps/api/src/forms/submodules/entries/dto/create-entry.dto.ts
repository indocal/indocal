import {
  FormField as DBFormFieldModel,
  User as DBUserModel,
} from '@prisma/client';
import { IsObject, IsUUID, IsOptional } from 'class-validator';

import { UUID } from '@/common';

export type FormFieldAnswer = {
  field: DBFormFieldModel;
  content:
    | TextFormFieldAnswer
    | TextAreaFormFieldAnswer
    | NumberFormFieldAnswer
    | DniFormFieldAnswer
    | PhoneFormFieldAnswer
    | EmailFormFieldAnswer
    | CheckboxFormFieldAnswer
    | SelectFormFieldAnswer
    | RadioFormFieldAnswer
    | TimeFormFieldAnswer
    | DateFormFieldAnswer
    | DateTimeFormFieldAnswer
    | UsersFormFieldAnswer
    | SectionFormFieldAnswer
    | TableFormFieldAnswer
    | null;
};

export class CreateFormEntryDto {
  @IsObject({ each: true })
  answers: FormFieldAnswer[];

  @IsUUID()
  form: UUID;

  @IsUUID()
  @IsOptional()
  answeredBy?: UUID;
}

export default CreateFormEntryDto;

////////////////////
// Answer by type //
////////////////////

export type TextFormFieldAnswer = string;

export type TextAreaFormFieldAnswer = string;

export type NumberFormFieldAnswer = number;

export type DniFormFieldAnswer = string;

export type PhoneFormFieldAnswer = string;

export type EmailFormFieldAnswer = string;

export type CheckboxFormFieldAnswer = boolean;

export type SelectFormFieldAnswer = string | string[];

export type RadioFormFieldAnswer = string;

export type TimeFormFieldAnswer = Date;

export type DateFormFieldAnswer = Date;

export type DateTimeFormFieldAnswer = Date;

export type UsersFormFieldAnswer = DBUserModel | DBUserModel[];

export type SectionFormFieldAnswer = Record<
  string,
  | TextFormFieldAnswer
  | TextAreaFormFieldAnswer
  | NumberFormFieldAnswer
  | DniFormFieldAnswer
  | PhoneFormFieldAnswer
  | EmailFormFieldAnswer
  | CheckboxFormFieldAnswer
  | SelectFormFieldAnswer
  | RadioFormFieldAnswer
  | TimeFormFieldAnswer
  | DateFormFieldAnswer
  | DateTimeFormFieldAnswer
  | UsersFormFieldAnswer
  | null
>;

export type TableFormFieldAnswer = Array<
  Record<
    string,
    | TextFormFieldAnswer
    | TextAreaFormFieldAnswer
    | NumberFormFieldAnswer
    | DniFormFieldAnswer
    | PhoneFormFieldAnswer
    | EmailFormFieldAnswer
    | CheckboxFormFieldAnswer
    | SelectFormFieldAnswer
    | RadioFormFieldAnswer
    | TimeFormFieldAnswer
    | DateFormFieldAnswer
    | DateTimeFormFieldAnswer
    | UsersFormFieldAnswer
    | null
  >
>;
