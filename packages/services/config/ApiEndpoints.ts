export enum ApiEndpoints {
  LOGS = '/logs',
  LOGS_COUNT = '/logs/count',

  SIGN_IN = '/auth/local/sign-in',
  RESTORE_PASSWORD = '/auth/local/restore-password',
  ME = '/auth/me',

  USERS = '/auth/users',
  USERS_COUNT = '/auth/users/count',
  USERS_ROLES = '/auth/roles',
  USERS_ROLES_COUNT = '/auth/roles/count',
  USERS_GROUPS = '/auth/groups',
  USERS_GROUPS_COUNT = '/auth/groups/count',

  FORMS = '/forms',
  FORMS_COUNT = '/forms/count',
  FORMS_ENTRIES = '/entries',
  FORMS_ENTRIES_COUNT = '/entries/count',
  FORMS_ENTRIES_STATS = '/entries/stats',

  EVENTS = '/events',
  EVENTS_COUNT = '/events/count',

  SUPPLIES = 'warehouse/supplies',
  SUPPLIES_COUNT = 'warehouse/supplies/count',
  SUPPLIERS = 'warehouse/suppliers',
  SUPPLIERS_COUNT = 'warehouse/suppliers/count',
  ORDERS = 'warehouse/orders',
  ORDERS_COUNT = 'warehouse/orders/count',
  INVENTORY_MOVEMENTS = 'warehouse/movements',
  INVENTORY_MOVEMENTS_COUNT = 'warehouse/movements/count',

  FOLDERS = 'uploads/folders',
  FOLDERS_COUNT = 'uploads/folders/count',
  FILES = 'uploads/files',
  FILES_COUNT = 'uploads/files/count',
}

export default ApiEndpoints;
