import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateSectionPlaceholderItemType,
  ServiceCertificateTemplateSectionPlaceholderConfig,
} from '@indocal/services';

import { highlightTextItem, highlightSignatureItem } from './utils';

export function highlightSectionPlaceholder(
  placeholder: ServiceCertificateTemplatePlaceholder,
  key: string
): string {
  const skeletons = {
    [ServiceCertificateTemplateSectionPlaceholderItemType.TEXT]:
      highlightTextItem,

    [ServiceCertificateTemplateSectionPlaceholderItemType.SIGNATURE]:
      highlightSignatureItem,
  };

  const config = placeholder.config as
    | ServiceCertificateTemplateSectionPlaceholderConfig
    | undefined;

  const item = config?.items.find((item) => {
    const [, name] = key.split('__');

    return item.name === name;
  });

  return item
    ? skeletons[item.type](item)
    : `<span
          style="font-family: Courier-BoldOblique;
          background-color: rgba(255, 0, 0, 0.7)">${key}</span>`;
}

export default highlightSectionPlaceholder;
