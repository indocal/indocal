import {
  useReducer,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { useSnackbar } from 'notistack';

import {
  useUserRole,
  ServiceError,
  UUID,
  UserRole,
  UserRolePermissions,
} from '@indocal/services';

import { indocal } from '@/lib';

///////////
// State //
///////////

const initialContextState: UserRolePermissionsManagementPanelContextState = {
  saving: false,
  permissions: null,
};

interface UserRolePermissionsManagementPanelContextState {
  saving: boolean;
  permissions: UserRolePermissions | null;
}

type UserRolePermissionsManagementPanelContextStateAction =
  | {
      type: 'SET_SAVING';
      saving: boolean;
    }
  | {
      type: 'SET_PERMISSIONS';
      permissions: UserRolePermissions;
    }
  | {
      type: 'TOGGLE_PERMISSION';
      scope: string;
      action: string;
    };

function reducer(
  state: UserRolePermissionsManagementPanelContextState,
  action: UserRolePermissionsManagementPanelContextStateAction
): UserRolePermissionsManagementPanelContextState {
  switch (action.type) {
    case 'SET_SAVING':
      return {
        ...state,
        saving: action.saving,
      };

    case 'SET_PERMISSIONS':
      return {
        ...state,
        permissions: action.permissions,
      };

    case 'TOGGLE_PERMISSION':
      return {
        ...state,
        permissions: {
          ...state.permissions,
          [action.scope]: {
            ...(state.permissions && state.permissions[action.scope]),
            [action.action]:
              state.permissions && state.permissions[action.scope]
                ? !state.permissions[action.scope][action.action]
                : true,
          },
        },
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UserRolePermissionsManagementPanelContextValue =
  {
    loading: false,
    validating: false,
    saving: initialContextState.saving,
    role: null,
    permissions: initialContextState.permissions,
    error: null,
    togglePermission: () => undefined,
    save: async () => undefined,
  };

export interface UserRolePermissionsManagementPanelContextValue {
  loading: boolean;
  validating: boolean;
  saving: boolean;
  role: UserRole | null;
  permissions: UserRolePermissions | null;
  error: ServiceError | null;
  togglePermission: (scope: string, action: string) => void;
  save: () => Promise<void>;
}

const UserRolePermissionsManagementPanelContext =
  createContext<UserRolePermissionsManagementPanelContextValue>(
    initialContextValue
  );

export interface UserRolePermissionsManagementPanelProviderProps {
  role: UUID | UserRole;
}

export const UserRolePermissionsManagementPanelProvider: React.FC<
  React.PropsWithChildren<UserRolePermissionsManagementPanelProviderProps>
> = ({ role: entity, children }) => {
  const { loading, validating, role, error } = useUserRole(
    typeof entity === 'string' ? entity : entity.id
  );

  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleTogglePermission = useCallback(
    (scope: string, action: string) =>
      dispatch({ type: 'TOGGLE_PERMISSION', scope, action }),
    []
  );

  const handleSave = useCallback(async () => {
    if (!state.permissions) return;

    dispatch({ type: 'SET_SAVING', saving: true });

    const { error } = await indocal.auth.roles.update(
      typeof entity === 'string' ? entity : entity.id,
      { permissions: state.permissions }
    );

    if (error) {
      enqueueSnackbar(
        error.details
          ? error.details.reduce(
              (acc, current) => (acc ? `${acc} | ${current}` : current),
              ``
            )
          : error.message,
        { variant: 'error' }
      );
    } else {
      enqueueSnackbar('Permisos actualizados exitosamente', {
        variant: 'success',
      });
    }

    dispatch({ type: 'SET_SAVING', saving: false });
  }, [entity, state.permissions, enqueueSnackbar]);

  useEffect(() => {
    if (!loading && role) {
      dispatch({
        type: 'SET_PERMISSIONS',
        permissions: role.permissions.reduce<UserRolePermissions>(
          (permissions, permission) => {
            const [scope, action] = permission.action.split('::');

            return {
              ...permissions,
              [scope]: {
                ...permissions[scope],
                [action]: true,
              },
            };
          },
          {}
        ),
      });
    }
  }, [loading, role]);

  return (
    <UserRolePermissionsManagementPanelContext.Provider
      value={{
        loading,
        validating,
        saving: state.saving,
        role,
        permissions: state.permissions,
        error,
        togglePermission: handleTogglePermission,
        save: handleSave,
      }}
    >
      {children}
    </UserRolePermissionsManagementPanelContext.Provider>
  );
};

export function useUserRolePermissionsManagementPanel(): UserRolePermissionsManagementPanelContextValue {
  return useContext(UserRolePermissionsManagementPanelContext);
}

export default UserRolePermissionsManagementPanelProvider;
