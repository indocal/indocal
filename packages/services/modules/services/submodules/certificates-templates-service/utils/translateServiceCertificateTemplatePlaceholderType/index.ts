import { ServiceCertificateTemplatePlaceholderType } from '../../types';

export function translateServiceCertificateTemplatePlaceholderType(
  type: ServiceCertificateTemplatePlaceholderType
): string {
  const translations: Record<
    ServiceCertificateTemplatePlaceholderType,
    string
  > = {
    TEXT: 'TEXT',
    TABLE: 'TABLE',
    SIGNATURE: 'SIGNATURE',
  };

  return translations[type] ?? type;
}

export default translateServiceCertificateTemplatePlaceholderType;
