export function translateModel(model: string): string {
  const translations: Record<string, string> = {
    user: 'Usuarios',
    userRole: 'Roles',
    userRolePermission: 'Permisos',
  };

  return translations[model] ?? model;
}

export default translateModel;
