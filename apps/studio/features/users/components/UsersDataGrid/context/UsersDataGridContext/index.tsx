import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: UsersDataGridContextState = {
  isAddUserDialogOpen: false,
};

interface UsersDataGridContextState {
  isAddUserDialogOpen: boolean;
}

type UsersDataGridContextStateAction = {
  type: 'TOGGLE_ADD_USER_DIALOG';
};

function reducer(
  state: UsersDataGridContextState,
  action: UsersDataGridContextStateAction
): UsersDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_USER_DIALOG':
      return {
        ...state,
        isAddUserDialogOpen: !state.isAddUserDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UsersDataGridContextValue = {
  isAddUserDialogOpen: initialContextState.isAddUserDialogOpen,
  toggleAddUserDialog: () => undefined,
};

export interface UsersDataGridContextValue {
  isAddUserDialogOpen: boolean;
  toggleAddUserDialog: () => void;
}

const UsersDataGridContext =
  createContext<UsersDataGridContextValue>(initialContextValue);

export const UsersDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddUserDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_USER_DIALOG' }),
    []
  );

  return (
    <UsersDataGridContext.Provider
      value={{
        isAddUserDialogOpen: state.isAddUserDialogOpen,
        toggleAddUserDialog: handleToggleAddUserDialog,
      }}
    >
      {children}
    </UsersDataGridContext.Provider>
  );
};

export function useUsersDataGrid(): UsersDataGridContextValue {
  return useContext(UsersDataGridContext);
}

export default UsersDataGridProvider;
