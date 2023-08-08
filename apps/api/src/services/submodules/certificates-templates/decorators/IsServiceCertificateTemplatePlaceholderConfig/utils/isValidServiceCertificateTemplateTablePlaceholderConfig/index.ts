export function isValidServiceCertificateTemplateTablePlaceholderConfig(
  target: any
): boolean {
  if (!('columns' in target)) return false;

  return target.columns.every((column: any) => {
    if ('type' in column && 'name' in column && 'heading' in column) {
      if (!['TEXT', 'SIGNATURE'].includes(column.type)) return false;
      if (typeof column.name !== 'string') return false;
      if (typeof column.heading !== 'string') return false;

      return true;
    }

    return false;
  });
}

export default isValidServiceCertificateTemplateTablePlaceholderConfig;
