import { ServiceCertificateTemplatePlaceholderType } from '../../types';

export function translateServiceCertificateTemplatePlaceholderType(
  type: ServiceCertificateTemplatePlaceholderType
): string {
  const translations: Record<
    ServiceCertificateTemplatePlaceholderType,
    string
  > = {
    TEXT: 'Texto',
    SIGNATURE: 'Firma',
    SECTION: 'Sección',
    TABLE: 'Tabla',
  };

  return translations[type] ?? type;
}

export default translateServiceCertificateTemplatePlaceholderType;
