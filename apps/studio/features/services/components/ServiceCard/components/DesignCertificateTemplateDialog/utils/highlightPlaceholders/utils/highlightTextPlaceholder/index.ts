import { ServiceCertificateTemplatePlaceholder } from '@indocal/services';

export function highlightTextPlaceholder(
  placeholder: ServiceCertificateTemplatePlaceholder
): string {
  const html = `<span
                  style="font-family: Courier-BoldOblique;
                  background-color: rgba(0, 255, 0, 0.7)"
                >${placeholder.title}</span>`;

  return html;
}

export default highlightTextPlaceholder;
