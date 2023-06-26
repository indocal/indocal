import {
  CertificateTemplateLayout,
  CertificateTemplatePlaceholder,
} from './ServiceCertificateTemplate';

export type UpsertServiceCertificateTemplateDto = {
  layout: CertificateTemplateLayout;
  content?: string | null;
  styles?: string | null;
  placeholders: CertificateTemplatePlaceholder[];
};

export default UpsertServiceCertificateTemplateDto;
