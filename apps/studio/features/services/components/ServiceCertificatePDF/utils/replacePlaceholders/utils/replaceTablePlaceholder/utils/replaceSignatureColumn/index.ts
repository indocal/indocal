export function replaceSignatureColumn(value: string): string {
  return `<img src="${value}" style="width: 100%; height: auto; object-fit: contain; object-position: center">`;
}

export default replaceSignatureColumn;
