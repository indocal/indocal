export function translatePermissionAction(action: string): string {
  const translations: Record<string, string> = {
    read: 'Leer',
    create: 'Crear',
    update: 'Modificar',
    delete: 'Eliminar',
  };

  return translations[action] ?? action;
}

export default translatePermissionAction;
