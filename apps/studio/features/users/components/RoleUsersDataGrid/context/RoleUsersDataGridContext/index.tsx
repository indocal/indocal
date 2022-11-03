import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: RoleUsersDataGridContextState = {
  isManageRoleUsersDialogOpen: false,
};

interface RoleUsersDataGridContextState {
  isManageRoleUsersDialogOpen: boolean;
}

type RoleUsersDataGridContextStateAction = {
  type: 'TOGGLE_MANAGE_ROLE_USERS_DIALOG';
};

function reducer(
  state: RoleUsersDataGridContextState,
  action: RoleUsersDataGridContextStateAction
): RoleUsersDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_MANAGE_ROLE_USERS_DIALOG':
      return {
        ...state,
        isManageRoleUsersDialogOpen: !state.isManageRoleUsersDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: RoleUsersDataGridContextValue = {
  isManageRoleUsersDialogOpen: initialContextState.isManageRoleUsersDialogOpen,
  toggleManageRoleUsersDialog: () => undefined,
};

export interface RoleUsersDataGridContextValue {
  isManageRoleUsersDialogOpen: boolean;
  toggleManageRoleUsersDialog: () => void;
}

const RoleUsersDataGridContext =
  createContext<RoleUsersDataGridContextValue>(initialContextValue);

export const RoleUsersDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleManageRoleUsersDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_MANAGE_ROLE_USERS_DIALOG' }),
    []
  );

  return (
    <RoleUsersDataGridContext.Provider
      value={{
        isManageRoleUsersDialogOpen: state.isManageRoleUsersDialogOpen,
        toggleManageRoleUsersDialog: handleToggleManageRoleUsersDialog,
      }}
    >
      {children}
    </RoleUsersDataGridContext.Provider>
  );
};

export function useRoleUsersDataGrid(): RoleUsersDataGridContextValue {
  return useContext(RoleUsersDataGridContext);
}

export default RoleUsersDataGridProvider;
