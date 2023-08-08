import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import {
  ServiceCertificateTemplateLayout,
  ServiceCertificateTemplateLayoutOrientation,
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplatePlaceholderType,
  ServiceCertificateTemplatePlaceholderConfig,
} from '../entities';
import { IsServiceCertificateTemplatePlaceholderConfig } from '../decorators';

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

  @IsServiceCertificateTemplatePlaceholderConfig()
  @IsOptional()
  config?: ServiceCertificateTemplatePlaceholderConfig;
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
