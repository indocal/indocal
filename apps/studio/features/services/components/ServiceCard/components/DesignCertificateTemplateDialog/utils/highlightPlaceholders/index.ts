import { CertificateTemplatePlaceholder } from '@indocal/services';

export function highlightPlaceholders(
  html: string,
  placeholders: CertificateTemplatePlaceholder[]
): string {
  const regex = /{{(.*?)}}/g;

  const matches = html.match(regex);

  if (!matches) return html;

  const replaced = html.replace(regex, (_, placeholder) => {
    const key = placeholder.trim();

    const isValid = placeholders.some(
      (placeholder) => placeholder.name === key
    );

    return isValid
      ? `<span style="font-family: Courier-BoldOblique; background-color: rgba(0, 255, 0, 0.7)">${placeholder}</span>`
      : `<span style="font-family: Courier-BoldOblique; background-color: rgba(255, 0, 0, 0.7)">${placeholder}</span>`;
  });

  return replaced;
}

export default highlightPlaceholders;
