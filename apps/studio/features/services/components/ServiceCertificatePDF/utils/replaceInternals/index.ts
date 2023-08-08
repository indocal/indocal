import { getShortUUID, ServiceCertificate } from '@indocal/services';

import { getQRCode, serializeDate } from './utils';

export function replaceInternals(
  html: string,
  certificate: ServiceCertificate
): string {
  const regex = /\[\[(.*?)\]\]/g;

  const matches = html.match(regex);

  if (!matches) return html;

  const INTERNALS: Record<string, string> = {
    QR_CODE: getQRCode(certificate),

    REQUEST_ID: getShortUUID(certificate.request.id),
    REQUESTED_AT: serializeDate(certificate.request.createdAt),

    REQUESTER_USERNAME: certificate.user.username,
    REQUESTER_EMAIL: certificate.user.email,
    REQUESTER_NAME: certificate.user.name,

    CERTIFICATE_ID: getShortUUID(certificate.id),
    CERTIFICATED_AT: serializeDate(certificate.createdAt),
  };

  const replaced = html.replace(regex, (_, internal) => {
    const key: string = internal.trim();

    return INTERNALS[key] ?? key;
  });

  return replaced;
}

export default replaceInternals;
