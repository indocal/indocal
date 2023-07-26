import { ServiceCertificateData } from '@indocal/services';

export function replacePlaceholders(
  html: string,
  data: ServiceCertificateData
): string {
  const regex = /{{(.*?)}}/g;

  const matches = html.match(regex);

  if (!matches) return html;

  const replaced = html.replace(regex, (_, match) => {
    const key = match.trim();

    return data[key] || key;
  });

  return replaced;
}

export default replacePlaceholders;
