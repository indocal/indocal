import { ServiceCertificateData } from '@indocal/services';

export type ReplaceSignaturePlaceholderParams = {
  key: string;
  data: ServiceCertificateData;
};

export function replaceSignaturePlaceholder({
  key,
  data,
}: ReplaceSignaturePlaceholderParams): string {
  const FALLBACK = 'https://placehold.co/600x400/png?text=404';

  const signature = data[key];

  return typeof signature === 'string' && signature.startsWith('data:image')
    ? `<img src=${signature} style="width: 100%; height: auto; object-fit: contain; object-position: center">`
    : `<img src=${FALLBACK} style="width: 100%; height: auto; object-fit: contain; object-position: center">`;
}

export default replaceSignaturePlaceholder;
