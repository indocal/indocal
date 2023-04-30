import { UUID } from '../../../common';

type Field = {
  field: UUID;
  order: number;
};

export interface ReorderFormFieldsDto {
  sortedFields: Field[];
}

export default ReorderFormFieldsDto;
