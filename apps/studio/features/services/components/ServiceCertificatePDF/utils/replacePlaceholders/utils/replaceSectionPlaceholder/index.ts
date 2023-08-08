import {
  ServiceCertificateData,
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateSectionPlaceholderItemType,
  ServiceCertificateTemplateSectionPlaceholderConfig,
} from '@indocal/services';

import { replaceTextItem, replaceSignatureItem } from './utils';

export type ReplaceSectionPlaceholderParams = {
  key: string;
  data: ServiceCertificateData;
  placeholder: ServiceCertificateTemplatePlaceholder;
};

export function replaceSectionPlaceholder({
  key,
  data,
  placeholder,
}: ReplaceSectionPlaceholderParams): string {
  const replacers = {
    [ServiceCertificateTemplateSectionPlaceholderItemType.TEXT]:
      replaceTextItem,

    [ServiceCertificateTemplateSectionPlaceholderItemType.SIGNATURE]:
      replaceSignatureItem,
  };

  const config =
    placeholder.config as ServiceCertificateTemplateSectionPlaceholderConfig | null;

  const item = config?.items.find((item) => {
    const [, name] = key.split('__');

    return item.name === name;
  });

  return item ? replacers[item.type]({ key, data }) : key;
}

export default replaceSectionPlaceholder;
