export enum ApiEndpoints {
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

  EVENTS = '/events',
  EVENTS_COUNT = '/events/count',
}

export default ApiEndpoints;
