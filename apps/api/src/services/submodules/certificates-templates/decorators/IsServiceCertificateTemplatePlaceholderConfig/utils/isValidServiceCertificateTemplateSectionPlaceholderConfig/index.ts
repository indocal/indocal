export function isValidServiceCertificateTemplateSectionPlaceholderConfig(
  target: any
): boolean {
  if (!('items' in target)) return false;

  return target.items.every((item: any) => {
    if ('type' in item && 'name' in item && 'title' in item) {
      if (!['TEXT', 'SIGNATURE'].includes(item.type)) return false;
      if (typeof item.name !== 'string') return false;
      if (typeof item.title !== 'string') return false;

      return true;
    }

    return false;
  });
}

export default isValidServiceCertificateTemplateSectionPlaceholderConfig;
