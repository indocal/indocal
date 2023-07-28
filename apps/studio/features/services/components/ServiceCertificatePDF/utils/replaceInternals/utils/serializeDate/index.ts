export function serializeDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('es-do');
}

export default serializeDate;
