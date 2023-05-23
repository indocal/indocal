import { Design, Placeholder } from './ServiceCertificateTemplate';

export type UpsertServiceCertificateTemplateDto = {
  design: Design;
  content?: string | null;
  styles?: string | null;
  placeholders: Placeholder[];
};

export default UpsertServiceCertificateTemplateDto;
