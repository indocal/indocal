import { IsUUID, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { UUID } from '@/common';

class Field {
  @IsUUID()
  field: UUID;

  @IsPositive()
  order: number;
}

export class ReorderFormFieldsDto {
  @ValidateNested({ each: true })
  @Type(() => Field)
  sortedFields: Field[];
}

export default ReorderFormFieldsDto;
