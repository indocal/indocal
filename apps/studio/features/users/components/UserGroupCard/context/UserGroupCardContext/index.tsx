import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: UserGroupCardContextState = {
  isEditUserGroupDialogOpen: false,
};

interface UserGroupCardContextState {
  isEditUserGroupDialogOpen: boolean;
}

type UserGroupCardContextStateAction = {
  type: 'TOGGLE_EDIT_USER_GROUP_DIALOG';
};

function reducer(
  state: UserGroupCardContextState,
  action: UserGroupCardContextStateAction
): UserGroupCardContextState {
  switch (action.type) {
    case 'TOGGLE_EDIT_USER_GROUP_DIALOG':
      return {
        ...state,
        isEditUserGroupDialogOpen: !state.isEditUserGroupDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UserGroupCardContextValue = {
  isEditUserGroupDialogOpen: initialContextState.isEditUserGroupDialogOpen,
  toggleEditUserGroupDialog: () => undefined,
};

export interface UserGroupCardContextValue {
  isEditUserGroupDialogOpen: boolean;
  toggleEditUserGroupDialog: () => void;
}

const UserGroupCardContext =
  createContext<UserGroupCardContextValue>(initialContextValue);

export const UserGroupCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditUserGroupDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_USER_GROUP_DIALOG' }),
    []
  );

  return (
    <UserGroupCardContext.Provider
      value={{
        isEditUserGroupDialogOpen: state.isEditUserGroupDialogOpen,
        toggleEditUserGroupDialog: handleToggleEditUserGroupDialog,
      }}
    >
      {children}
    </UserGroupCardContext.Provider>
  );
};

export function useUserGroupCard(): UserGroupCardContextValue {
  return useContext(UserGroupCardContext);
}

export default UserGroupCardProvider;
