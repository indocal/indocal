import { Service } from '@indocal/services';

import { previewQRCode, highlightInternal } from './utils';

export function previewInternals(html: string, service: Service): string {
  const regex = /\[\[(.*?)\]\]/g;

  const matches = html.match(regex);

  if (!matches) return html;

  const INTERNALS: Record<string, string> = {
    QR_CODE: previewQRCode(service),

    REQUEST_ID: highlightInternal('#-XXXXX'),
    REQUESTED_AT: highlightInternal('dd/mm/yyyy'),

    CERTIFICATE_ID: highlightInternal('#-XXXXX'),
    CERTIFICATED_AT: highlightInternal('dd/mm/yyyy'),
  };

  const replaced = html.replace(regex, (_, internal) => {
    const key: string = internal.trim();

    return INTERNALS[key] ?? key;
  });

  return replaced;
}

export default previewInternals;
