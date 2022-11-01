import {
  useReducer,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { useSnackbar } from 'notistack';

import { PermissionsByModel, UUID, UserRole } from '@indocal/services';

import { indocal } from '@/lib';

import { useUserRolePermissionsByRole } from '../../hooks';

///////////
// State //
///////////

const initialContextState: UserRolePermissionsManagamentPanelContextState = {
  permissions: null,
  saving: false,
};

interface UserRolePermissionsManagamentPanelContextState {
  permissions: PermissionsByModel | null;
  saving: boolean;
}

type UserRolePermissionsManagamentPanelContextStateAction =
  | {
      type: 'SET_PERMISSIONS';
      permissions: PermissionsByModel;
    }
  | {
      type: 'TOGGLE_ALL_MODEL_PERMISSIONS';
      model: string;
    }
  | {
      type: 'TOGGLE_PERMISSION';
      model: string;
      action: string;
    }
  | {
      type: 'SET_SAVING';
      value: boolean;
    };

function reducer(
  state: UserRolePermissionsManagamentPanelContextState,
  action: UserRolePermissionsManagamentPanelContextStateAction
): UserRolePermissionsManagamentPanelContextState {
  switch (action.type) {
    case 'SET_PERMISSIONS':
      return {
        ...state,
        permissions: action.permissions,
      };

    case 'TOGGLE_ALL_MODEL_PERMISSIONS':
      return {
        ...state,
        permissions: {
          ...state.permissions,
          [action.model]:
            state.permissions &&
            Object.values(state.permissions[action.model]).some(
              (value) => value === true
            )
              ? {
                  read: false,
                  create: false,
                  update: false,
                  delete: false,
                }
              : {
                  read: true,
                  create: true,
                  update: true,
                  delete: true,
                },
        },
      };

    case 'TOGGLE_PERMISSION':
      return {
        ...state,
        permissions: {
          ...state.permissions,
          [action.model]: {
            ...(state.permissions && state.permissions[action.model]),
            [action.action]: state.permissions
              ? !state.permissions[action.model][action.action]
              : true,
          },
        },
      };

    case 'SET_SAVING':
      return {
        ...state,
        saving: action.value,
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
    role: 'public',
    permissions: initialContextState.permissions,
    saving: initialContextState.saving,
    toggleAllModelPermissions: () => undefined,
    togglePermission: () => undefined,
    save: async () => undefined,
  };

export interface UserRolePermissionsManagamentPanelContextValue {
  role: UUID | UserRole;
  permissions: PermissionsByModel | null;
  saving: boolean;
  toggleAllModelPermissions: (model: string) => void;
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
> = ({ role, children }) => {
  const { loading, permissions } = useUserRolePermissionsByRole(role);

  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(reducer, initialContextState);

  useEffect(() => {
    if (!loading && permissions) {
      dispatch({
        type: 'SET_PERMISSIONS',
        permissions,
      });
    }
  }, [loading, permissions]);

  const handleToggleAllModelPermissions = useCallback(
    (model: string) =>
      dispatch({
        type: 'TOGGLE_ALL_MODEL_PERMISSIONS',
        model,
      }),
    []
  );

  const handleTogglePermission = useCallback(
    (model: string, action: string) =>
      dispatch({
        type: 'TOGGLE_PERMISSION',
        model,
        action,
      }),
    []
  );

  const handleSave = useCallback(async () => {
    if (state.permissions) {
      dispatch({ type: 'SET_SAVING', value: true });

      const { error } = await indocal.auth.roles.update(
        typeof role === 'string' ? role : role.id,
        // { permissions: state.permissions }
        {}
      );

      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Permisos actualizados exitosamente', {
          variant: 'success',
        });
      }

      dispatch({ type: 'SET_SAVING', value: false });
    }
  }, [role, state.permissions, enqueueSnackbar]);

  return (
    <UserRolePermissionsManagamentPanelContext.Provider
      value={{
        role,
        permissions: state.permissions,
        saving: state.saving,
        toggleAllModelPermissions: handleToggleAllModelPermissions,
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
