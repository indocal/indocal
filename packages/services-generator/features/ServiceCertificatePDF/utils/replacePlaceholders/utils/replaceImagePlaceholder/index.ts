import { ServiceCertificateData, File } from '@indocal/services';

export type ReplaceImagePlaceholderParams = {
  key: string;
  data: ServiceCertificateData;
};

export function replaceImagePlaceholder({
  key,
  data,
}: ReplaceImagePlaceholderParams): string {
  const FALLBACK = 'https://placehold.co/600x400/png?text=404';

  const file = data[key] as File;

  const image = new URL(file.path, process.env.NEXT_PUBLIC_BACKEND_URL);

  return typeof image.href === 'string'
    ? `<img src=${image.href} style="width: 100%; height: auto; object-fit: contain; object-position: center">`
    : `<img src=${FALLBACK} style="width: 100%; height: auto; object-fit: contain; object-position: center">`;
}

export default replaceImagePlaceholder;
