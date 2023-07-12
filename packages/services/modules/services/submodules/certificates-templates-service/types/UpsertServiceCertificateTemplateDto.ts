import {
  ServiceCertificateTemplateLayout,
  ServiceCertificateTemplatePlaceholder,
} from './ServiceCertificateTemplate';

export type UpsertServiceCertificateTemplateDto = Partial<{
  layout: ServiceCertificateTemplateLayout;
  content: string;
  styles: string;
  placeholders: ServiceCertificateTemplatePlaceholder[];
  assets: File[];
}>;

export default UpsertServiceCertificateTemplateDto;
