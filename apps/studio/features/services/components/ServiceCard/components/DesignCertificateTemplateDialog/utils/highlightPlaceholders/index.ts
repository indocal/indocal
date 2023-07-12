import { ServiceCertificateTemplatePlaceholder } from '@indocal/services';

export function highlightPlaceholders(
  html: string,
  placeholders: ServiceCertificateTemplatePlaceholder[]
): string {
  const regex = /{{(.*?)}}/g;

  const matches = html.match(regex);

  if (!matches) return html;

  const replaced = html.replace(regex, (_, match) => {
    const key = match.trim();

    const placeholder = placeholders.find(
      (placeholder) => placeholder.name === key
    );

    return placeholder
      ? `<span
          style="font-family: Courier-BoldOblique;
          background-color: rgba(0, 255, 0, 0.7)">${placeholder.title}</span>`
      : `<span
          style="font-family: Courier-BoldOblique;
          background-color: rgba(255, 0, 0, 0.7)">${key}</span>`;
  });

  return replaced;
}

export default highlightPlaceholders;
