import { ServiceCertificateTemplateSectionPlaceholderItem } from '@indocal/services';

export function highlightTextItem(
  item: ServiceCertificateTemplateSectionPlaceholderItem
): string {
  const html = `<span
                  style="font-family: Courier-BoldOblique;
                  background-color: rgba(0, 255, 0, 0.7)"
                >${item.title}</span>`;

  return html;
}

export default highlightTextItem;
