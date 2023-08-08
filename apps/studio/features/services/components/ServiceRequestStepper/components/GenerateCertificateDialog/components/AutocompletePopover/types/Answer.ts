import {
  UUID,
  FormFieldType,
  SectionFormFieldItemType,
  TableFormFieldColumnType,
} from '@indocal/services';

export type Field = {
  id: UUID;
  type: FormFieldType | SectionFormFieldItemType | TableFormFieldColumnType;
  title: string;
  description: string | null;
};

export type Answer = {
  field: Field;
  content: string;
};

export default Answer;
