import { ServiceCertificate } from '@indocal/services';

export function getAssetsSources(
  html: string,
  assets: ServiceCertificate['template']['assets']
): string {
  const regex = /\(\((.*?)\)\)/g;

  const matches = html.match(regex);

  if (!matches) return html;

  const map: Record<string, string> = assets.reduce((prev, current) => {
    const url = new URL(current.path, process.env.NEXT_PUBLIC_BACKEND_URL);

    return {
      ...prev,
      [current.name]: url.toString(),
    };
  }, {});

  const replaced = html.replace(regex, (_, asset) => {
    const key = asset.trim();

    return map[key] ?? 'https://placehold.co/600x400/png?text=404';
  });

  return replaced;
}

export default getAssetsSources;
