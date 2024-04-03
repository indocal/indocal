import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplatePlaceholderType,
} from '@indocal/services';

import {
  highlightTextPlaceholder,
  highlightSignaturePlaceholder,
  highlightSectionPlaceholder,
  highlightTablePlaceholder,
} from './utils';

export function highlightPlaceholders(
  html: string,
  placeholders: ServiceCertificateTemplatePlaceholder[]
): string {
  const regex = /{{(.*?)}}/g;

  const matches = html.match(regex);

  if (!matches) return html;

  const replaced = html.replace(regex, (_, match) => {
    const skeletons = {
      [ServiceCertificateTemplatePlaceholderType.TEXT]:
        highlightTextPlaceholder,

      [ServiceCertificateTemplatePlaceholderType.SIGNATURE]:
        highlightSignaturePlaceholder,

      [ServiceCertificateTemplatePlaceholderType.IMAGE]:
        highlightSignaturePlaceholder,

      [ServiceCertificateTemplatePlaceholderType.SECTION]:
        highlightSectionPlaceholder,

      [ServiceCertificateTemplatePlaceholderType.TABLE]:
        highlightTablePlaceholder,
    };

    const key: string = match.trim();

    const placeholder = placeholders.find((placeholder) => {
      if (key.includes('__')) return key.startsWith(placeholder.name);

      return placeholder.name === key;
    });

    return placeholder
      ? skeletons[placeholder.type](placeholder, key)
      : `<span
          style="font-family: Courier-BoldOblique;
          background-color: rgba(255, 0, 0, 0.7)">${key}</span>`;
  });

  return replaced;
}

export default highlightPlaceholders;
