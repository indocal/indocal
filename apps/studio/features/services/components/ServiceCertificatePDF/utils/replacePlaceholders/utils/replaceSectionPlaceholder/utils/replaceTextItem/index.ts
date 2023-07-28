import { ServiceCertificateData } from '@indocal/services';

export type ReplaceTextItemParams = {
  key: string;
  data: ServiceCertificateData;
};

export function replaceTextItem({ key, data }: ReplaceTextItemParams): string {
  const text = data[key];

  return typeof text === 'string' ? text : key;
}

export default replaceTextItem;
