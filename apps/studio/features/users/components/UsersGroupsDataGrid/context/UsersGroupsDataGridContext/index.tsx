import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: UsersGroupsDataGridContextState = {
  isAddUserGroupDialogOpen: false,
};

interface UsersGroupsDataGridContextState {
  isAddUserGroupDialogOpen: boolean;
}

type UsersGroupsDataGridContextStateAction = {
  type: 'TOGGLE_ADD_USER_GROUP_DIALOG';
};

function reducer(
  state: UsersGroupsDataGridContextState,
  action: UsersGroupsDataGridContextStateAction
): UsersGroupsDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_USER_GROUP_DIALOG':
      return {
        ...state,
        isAddUserGroupDialogOpen: !state.isAddUserGroupDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UsersGroupsDataGridContextValue = {
  isAddUserGroupDialogOpen: initialContextState.isAddUserGroupDialogOpen,
  toggleAddUserGroupDialog: () => undefined,
};

export interface UsersGroupsDataGridContextValue {
  isAddUserGroupDialogOpen: boolean;
  toggleAddUserGroupDialog: () => void;
}

const UsersGroupsDataGridContext =
  createContext<UsersGroupsDataGridContextValue>(initialContextValue);

export const UsersGroupsDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddUserGroupDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_USER_GROUP_DIALOG' }),
    []
  );

  return (
    <UsersGroupsDataGridContext.Provider
      value={{
        isAddUserGroupDialogOpen: state.isAddUserGroupDialogOpen,
        toggleAddUserGroupDialog: handleToggleAddUserGroupDialog,
      }}
    >
      {children}
    </UsersGroupsDataGridContext.Provider>
  );
};

export function useUsersGroupsDataGrid(): UsersGroupsDataGridContextValue {
  return useContext(UsersGroupsDataGridContext);
}

export default UsersGroupsDataGridProvider;
