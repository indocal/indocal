import { ServiceCertificateData } from '@indocal/services';

export type ReplaceTextPlaceholderParams = {
  key: string;
  data: ServiceCertificateData;
};

export function replaceTextPlaceholder({
  key,
  data,
}: ReplaceTextPlaceholderParams): string {
  const text = data[key];

  return typeof text === 'string' ? text : key;
}

export default replaceTextPlaceholder;
