import { IsString, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import {
  CertificateTemplateLayout,
  CertificateTemplateLayoutOrientation,
  CertificateTemplatePlaceholder,
} from '../entities';

////////////
// Design //
////////////

class LayoutSchema {
  @IsEnum(CertificateTemplateLayoutOrientation)
  orientation: CertificateTemplateLayoutOrientation;
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
  @Type(() => LayoutSchema)
  layout: CertificateTemplateLayout;

  @IsString()
  @IsOptional()
  content?: string | null;

  @IsString()
  @IsOptional()
  styles?: string | null;

  @ValidateNested({ each: true })
  @Type(() => PlaceholderSchema)
  placeholders: CertificateTemplatePlaceholder[];
}

export default UpsertServiceCertificateTemplateDto;
