import {
  useReducer,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { useSnackbar } from 'notistack';

import { useUserRole, ServiceError, UUID, UserRole } from '@indocal/services';

import { indocal } from '@/lib';

///////////
// State //
///////////

const initialContextState: UserRolePermissionsManagamentPanelContextState = {
  saving: false,
  permissions: null,
};

interface UserRolePermissionsManagamentPanelContextState {
  saving: boolean;
  permissions: Record<string, Record<string, boolean>> | null;
}

type UserRolePermissionsManagamentPanelContextStateAction =
  | {
      type: 'SET_SAVING';
      saving: boolean;
    }
  | {
      type: 'SET_PERMISSIONS';
      permissions: Record<string, Record<string, boolean>>;
    }
  | {
      type: 'TOGGLE_PERMISSION';
      model: string;
      action: string;
    };

function reducer(
  state: UserRolePermissionsManagamentPanelContextState,
  action: UserRolePermissionsManagamentPanelContextStateAction
): UserRolePermissionsManagamentPanelContextState {
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
          [action.model]: {
            ...(state.permissions && state.permissions[action.model]),
            [action.action]:
              state.permissions && state.permissions[action.model]
                ? !state.permissions[action.model][action.action]
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

export const initialContextValue: UserRolePermissionsManagamentPanelContextValue =
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

export interface UserRolePermissionsManagamentPanelContextValue {
  loading: boolean;
  validating: boolean;
  saving: boolean;
  role: UserRole | null;
  permissions: Record<string, Record<string, boolean>> | null;
  error: ServiceError | null;
  togglePermission: (model: string, action: string) => void;
  save: () => Promise<void>;
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

  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleTogglePermission = useCallback(
    (model: string, action: string) =>
      dispatch({ type: 'TOGGLE_PERMISSION', model, action }),
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
      enqueueSnackbar(error.message, { variant: 'error' });
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
        permissions: role.permissions.reduce((permissions, permission) => {
          const [model, action] = permission.action.split('::');

          return {
            ...permissions,
            [model]: {
              ...permissions[model],
              [action]: true,
            },
          };
        }, {} as Record<string, Record<string, boolean>>),
      });
    }
  }, [loading, role]);

  return (
    <UserRolePermissionsManagamentPanelContext.Provider
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
    </UserRolePermissionsManagamentPanelContext.Provider>
  );
};

export function useUserRolePermissionsManagamentPanel(): UserRolePermissionsManagamentPanelContextValue {
  return useContext(UserRolePermissionsManagamentPanelContext);
}

export default UserRolePermissionsManagamentPanelProvider;
