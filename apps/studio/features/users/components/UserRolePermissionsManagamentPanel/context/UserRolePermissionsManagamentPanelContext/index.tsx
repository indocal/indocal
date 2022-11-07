import {
  useReducer,
  useMemo,
  useCallback,
  useContext,
  createContext,
} from 'react';

import { useUserRole, ServiceError, UUID, UserRole } from '@indocal/services';

///////////
// State //
///////////

const initialContextState: UserRolePermissionsManagamentPanelContextState = {
  loading: false,
  validating: false,
  role: null,
  permissions: null,
  error: null,
};

interface UserRolePermissionsManagamentPanelContextState {
  loading: boolean;
  validating: boolean;
  role: UserRole | null;
  permissions: Record<string, Record<string, boolean>> | null;
  error: ServiceError | null;
}

type UserRolePermissionsManagamentPanelContextStateAction = {
  type: 'TOGGLE_PERMISSION';
  model: string;
  action: string;
};

function reducer(
  state: UserRolePermissionsManagamentPanelContextState,
  action: UserRolePermissionsManagamentPanelContextStateAction
): UserRolePermissionsManagamentPanelContextState {
  switch (action.type) {
    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UserRolePermissionsManagamentPanelContextValue =
  {
    loading: initialContextState.loading,
    validating: initialContextState.validating,
    role: initialContextState.role,
    permissions: initialContextState.permissions,
    error: initialContextState.error,
  };

export interface UserRolePermissionsManagamentPanelContextValue {
  loading: boolean;
  validating: boolean;
  role: UserRole | null;
  permissions: Record<string, Record<string, boolean>> | null;
  error: ServiceError | null;
}

const UserRolePermissionsManagamentPanelContext =
  createContext<UserRolePermissionsManagamentPanelContextValue>(
    initialContextValue
  );

export interface UserRolePermissionsManagamentPanelProviderProps {
  role: UUID | UserRole;
}

export const UserRolePermissionsManagamentPanelProvider: React.FC<
  React.PropsWithChildren<UserRolePermissionsManagamentPanelProviderProps>
> = ({ role: entity, children }) => {
  const { loading, validating, role, error } = useUserRole(
    typeof entity === 'string' ? entity : entity.id
  );

  const permissions = useMemo<Record<string, Record<string, boolean>> | null>(
    () =>
      role
        ? role.permissions.reduce((permissions, permission) => {
            const [model, action] = permission.action.split('::');

            return {
              ...permissions,
              [model]: {
                ...permissions[model],
                [action]: true,
              },
            };
          }, {} as Record<string, Record<string, boolean>>)
        : null,
    [role]
  );

  return (
    <UserRolePermissionsManagamentPanelContext.Provider
      value={{ loading, validating, role, permissions, error }}
    >
      {children}
    </UserRolePermissionsManagamentPanelContext.Provider>
  );
};

export function useUserRolePermissionsManagamentPanel(): UserRolePermissionsManagamentPanelContextValue {
  return useContext(UserRolePermissionsManagamentPanelContext);
}

export default UserRolePermissionsManagamentPanelProvider;
