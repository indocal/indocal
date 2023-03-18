export function translateFormFieldHintPosition(
  position: 'BEFORE' | 'AFTER'
): string {
  const translations: Record<'BEFORE' | 'AFTER', string> = {
    BEFORE: 'Antes',
    AFTER: 'Después',
  };

  return translations[position] ?? position;
}

export default translateFormFieldHintPosition;
