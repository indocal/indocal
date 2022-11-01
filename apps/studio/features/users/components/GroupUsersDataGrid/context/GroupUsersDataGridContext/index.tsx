import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: GroupUsersDataGridContextState = {
  isManageGroupUsersDialogOpen: false,
};

interface GroupUsersDataGridContextState {
  isManageGroupUsersDialogOpen: boolean;
}

type GroupUsersDataGridContextStateAction = {
  type: 'TOGGLE_MANAGE_GROUP_USERS_DIALOG';
};

function reducer(
  state: GroupUsersDataGridContextState,
  action: GroupUsersDataGridContextStateAction
): GroupUsersDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_MANAGE_GROUP_USERS_DIALOG':
      return {
        ...state,
        isManageGroupUsersDialogOpen: !state.isManageGroupUsersDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: GroupUsersDataGridContextValue = {
  isManageGroupUsersDialogOpen:
    initialContextState.isManageGroupUsersDialogOpen,
  toggleManageGroupUsersDialog: () => undefined,
};

export interface GroupUsersDataGridContextValue {
  isManageGroupUsersDialogOpen: boolean;
  toggleManageGroupUsersDialog: () => void;
}

const GroupUsersDataGridContext =
  createContext<GroupUsersDataGridContextValue>(initialContextValue);

export const GroupUsersDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleManageGroupUsersDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_MANAGE_GROUP_USERS_DIALOG' }),
    []
  );

  return (
    <GroupUsersDataGridContext.Provider
      value={{
        isManageGroupUsersDialogOpen: state.isManageGroupUsersDialogOpen,
        toggleManageGroupUsersDialog: handleToggleManageGroupUsersDialog,
      }}
    >
      {children}
    </GroupUsersDataGridContext.Provider>
  );
};

export function useGroupUsersDataGrid(): GroupUsersDataGridContextValue {
  return useContext(GroupUsersDataGridContext);
}

export default GroupUsersDataGridProvider;
