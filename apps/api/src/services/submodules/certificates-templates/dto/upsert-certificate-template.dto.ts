import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import {
  ServiceCertificateTemplateLayout,
  ServiceCertificateTemplateLayoutOrientation,
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplatePlaceholderType,
} from '../entities';

////////////
// Design //
////////////

class LayoutSchema {
  @IsEnum(ServiceCertificateTemplateLayoutOrientation)
  orientation: ServiceCertificateTemplateLayoutOrientation;
}

/////////////////
// Placeholder //
/////////////////

class PlaceholderSchema {
  @IsEnum(ServiceCertificateTemplatePlaceholderType)
  type: ServiceCertificateTemplatePlaceholderType;

  @IsString()
  name: string;

  @IsString()
  title: string;
}

/////////
// DTO //
/////////

class UpsertServiceCertificateTemplateDtoSchema {
  @ValidateNested()
  @Type(() => LayoutSchema)
  layout: ServiceCertificateTemplateLayout;

  @IsString()
  content: string;

  @IsString()
  styles: string;

  @ValidateNested({ each: true })
  @Type(() => PlaceholderSchema)
  placeholders: ServiceCertificateTemplatePlaceholder[];
}

export class UpsertServiceCertificateTemplateDto extends PartialType(
  UpsertServiceCertificateTemplateDtoSchema
) {}

export default UpsertServiceCertificateTemplateDto;
