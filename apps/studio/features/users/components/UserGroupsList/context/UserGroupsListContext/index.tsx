import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: UserGroupsListContextState = {
  isManageUserGroupsDialogOpen: false,
};

interface UserGroupsListContextState {
  isManageUserGroupsDialogOpen: boolean;
}

type UserGroupsListContextStateAction = {
  type: 'TOGGLE_MANAGE_USER_GROUPS_DIALOG';
};

function reducer(
  state: UserGroupsListContextState,
  action: UserGroupsListContextStateAction
): UserGroupsListContextState {
  switch (action.type) {
    case 'TOGGLE_MANAGE_USER_GROUPS_DIALOG':
      return {
        ...state,
        isManageUserGroupsDialogOpen: !state.isManageUserGroupsDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UserGroupsListContextValue = {
  isManageUserGroupsDialogOpen:
    initialContextState.isManageUserGroupsDialogOpen,
  toggleManageUserGroupsDialog: () => undefined,
};

export interface UserGroupsListContextValue {
  isManageUserGroupsDialogOpen: boolean;
  toggleManageUserGroupsDialog: () => void;
}

const UserGroupsListContext =
  createContext<UserGroupsListContextValue>(initialContextValue);

export const UserGroupsListProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleManageUserGroupsDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_MANAGE_USER_GROUPS_DIALOG' }),
    []
  );

  return (
    <UserGroupsListContext.Provider
      value={{
        isManageUserGroupsDialogOpen: state.isManageUserGroupsDialogOpen,
        toggleManageUserGroupsDialog: handleToggleManageUserGroupsDialog,
      }}
    >
      {children}
    </UserGroupsListContext.Provider>
  );
};

export function useUserGroupsList(): UserGroupsListContextValue {
  return useContext(UserGroupsListContext);
}

export default UserGroupsListProvider;
