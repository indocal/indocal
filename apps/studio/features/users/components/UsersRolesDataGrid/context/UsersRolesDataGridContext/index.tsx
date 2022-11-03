import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: UsersRolesDataGridContextState = {
  isAddUserRoleDialogOpen: false,
};

interface UsersRolesDataGridContextState {
  isAddUserRoleDialogOpen: boolean;
}

type UsersRolesDataGridContextStateAction = {
  type: 'TOGGLE_ADD_USER_ROLE_DIALOG';
};

function reducer(
  state: UsersRolesDataGridContextState,
  action: UsersRolesDataGridContextStateAction
): UsersRolesDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_USER_ROLE_DIALOG':
      return {
        ...state,
        isAddUserRoleDialogOpen: !state.isAddUserRoleDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UsersRolesDataGridContextValue = {
  isAddUserRoleDialogOpen: initialContextState.isAddUserRoleDialogOpen,
  toggleAddUserRoleDialog: () => undefined,
};

export interface UsersRolesDataGridContextValue {
  isAddUserRoleDialogOpen: boolean;
  toggleAddUserRoleDialog: () => void;
}

const UsersRolesDataGridContext =
  createContext<UsersRolesDataGridContextValue>(initialContextValue);

export const UsersRolesDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddUserRoleDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_USER_ROLE_DIALOG' }),
    []
  );

  return (
    <UsersRolesDataGridContext.Provider
      value={{
        isAddUserRoleDialogOpen: state.isAddUserRoleDialogOpen,
        toggleAddUserRoleDialog: handleToggleAddUserRoleDialog,
      }}
    >
      {children}
    </UsersRolesDataGridContext.Provider>
  );
};

export function useUsersRolesDataGrid(): UsersRolesDataGridContextValue {
  return useContext(UsersRolesDataGridContext);
}

export default UsersRolesDataGridProvider;
