import {
  IsBooleanString,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Design, QR, Placeholder } from '../entities';
import { PageSizes } from '../types';

////////////
// Design //
////////////

class QRSchema {
  @IsBooleanString()
  include: string;

  @IsNumber()
  size: number;
}

class DesignSchema {
  @IsEnum(PageSizes)
  size: PageSizes;

  @ValidateNested()
  @Type(() => QRSchema)
  qr: QR;
}

/////////////////
// Placeholder //
/////////////////

class PlaceholderSchema {
  @IsString()
  name: string;
}

/////////
// DTO //
/////////

export class UpsertServiceCertificateTemplateDto {
  @ValidateNested()
  @Type(() => DesignSchema)
  design: Design;

  @IsString()
  @IsOptional()
  content?: string | null;

  @IsString()
  @IsOptional()
  styles?: string | null;

  @ValidateNested({ each: true })
  @Type(() => PlaceholderSchema)
  placeholders: Placeholder[];
}

export default UpsertServiceCertificateTemplateDto;
