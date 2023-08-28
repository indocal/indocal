import {
  ServiceCertificateData,
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplatePlaceholderType,
} from '@indocal/services';

import {
  replaceTextPlaceholder,
  replaceSignaturePlaceholder,
  replaceSectionPlaceholder,
  replaceTablePlaceholder,
} from './utils';

export type ReplacePlaceholdersParams = {
  html: string;
  data: ServiceCertificateData;
  placeholders: ServiceCertificateTemplatePlaceholder[];
};

export function replacePlaceholders({
  html,
  data,
  placeholders,
}: ReplacePlaceholdersParams): string {
  const regex = /{{(.*?)}}/g;

  const matches = html.match(regex);

  if (!matches) return html;

  const replaced = html.replace(regex, (_, match) => {
    const key = match.trim();

    const placeholder = placeholders.find((placeholder) => {
      if (key.includes('__')) return key.startsWith(placeholder.name);

      return placeholder.name === key;
    });

    if (!placeholder) return key;

    const replacers = {
      [ServiceCertificateTemplatePlaceholderType.TEXT]: replaceTextPlaceholder,

      [ServiceCertificateTemplatePlaceholderType.SIGNATURE]:
        replaceSignaturePlaceholder,

      [ServiceCertificateTemplatePlaceholderType.SECTION]:
        replaceSectionPlaceholder,

      [ServiceCertificateTemplatePlaceholderType.TABLE]:
        replaceTablePlaceholder,
    };

    return replacers[placeholder.type]({ key, data, placeholder });
  });

  return replaced;
}

export default replacePlaceholders;
