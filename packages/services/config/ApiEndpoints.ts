export enum ApiEndpoints {
  LOGS = '/logs',
  LOGS_COUNT = '/logs/count',

  SIGN_IN = '/auth/local/sign-in',
  RESTORE_PASSWORD = '/auth/local/restore-password',
  ME = '/auth/me',

  API_TOKENS = '/auth/api-tokens',
  API_TOKENS_COUNT = '/auth/api-tokens/count',
  USERS = '/auth/users',
  USERS_COUNT = '/auth/users/count',
  USERS_ROLES = '/auth/roles',
  USERS_ROLES_COUNT = '/auth/roles/count',
  USERS_GROUPS = '/auth/groups',
  USERS_GROUPS_COUNT = '/auth/groups/count',

  SERVICES = '/services',
  SERVICES_COUNT = '/services/count',
  SERVICES_REQUESTS = '/requests',
  SERVICES_REQUESTS_COUNT = '/requests/count',

  FORMS = '/forms',
  FORMS_COUNT = '/forms/count',
  FORMS_ENTRIES = '/entries',
  FORMS_ENTRIES_COUNT = '/entries/count',

  FOLDERS = '/uploads/folders',
  FOLDERS_COUNT = '/uploads/folders/count',
  FILES = '/uploads/files',
  FILES_COUNT = '/uploads/files/count',

  COMMENTS = '/comments',
  COMMENTS_COUNT = '/comments/count',

  SUPPLIES = '/warehouse/supplies',
  SUPPLIES_COUNT = '/warehouse/supplies/count',
  SUPPLIERS = '/warehouse/suppliers',
  SUPPLIERS_COUNT = '/warehouse/suppliers/count',
  ORDERS = '/warehouse/orders',
  ORDERS_COUNT = '/warehouse/orders/count',
  ORDERS_ACTIONS = '/warehouse/orders/actions',
  INVENTORY_MOVEMENTS = '/warehouse/movements',
  INVENTORY_MOVEMENTS_COUNT = '/warehouse/movements/count',
  SUPPLIES_REQUESTS = '/warehouse/requests',
  SUPPLIES_REQUESTS_COUNT = '/warehouse/requests/count',
  SUPPLIES_REQUESTS_ACTIONS = '/warehouse/requests/actions',
}

export default ApiEndpoints;
