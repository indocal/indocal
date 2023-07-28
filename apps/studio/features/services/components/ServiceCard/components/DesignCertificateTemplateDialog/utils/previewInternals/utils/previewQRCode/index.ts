import { Service } from '@indocal/services';

import { Pages } from '@/config';

export function previewQRCode(service: Service): string {
  const certificateUrl = new URL(
    `${Pages.SERVICES}/${service.id}`,
    process.env.NEXT_PUBLIC_SITE_URL
  );

  const qrCodeUrl = new URL('https://api.qrserver.com/v1/create-qr-code/');

  qrCodeUrl.searchParams.set('size', '150x150');
  qrCodeUrl.searchParams.set('data', certificateUrl.toString());

  return qrCodeUrl.toString();
}

export default previewQRCode;
