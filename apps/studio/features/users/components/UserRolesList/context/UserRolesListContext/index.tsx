import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: UserRolesListContextState = {
  isManageUserRolesDialogOpen: false,
};

interface UserRolesListContextState {
  isManageUserRolesDialogOpen: boolean;
}

type UserRolesListContextStateAction = {
  type: 'TOGGLE_MANAGE_USER_ROLES_DIALOG';
};

function reducer(
  state: UserRolesListContextState,
  action: UserRolesListContextStateAction
): UserRolesListContextState {
  switch (action.type) {
    case 'TOGGLE_MANAGE_USER_ROLES_DIALOG':
      return {
        ...state,
        isManageUserRolesDialogOpen: !state.isManageUserRolesDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UserRolesListContextValue = {
  isManageUserRolesDialogOpen: initialContextState.isManageUserRolesDialogOpen,
  toggleManageUserRolesDialog: () => undefined,
};

export interface UserRolesListContextValue {
  isManageUserRolesDialogOpen: boolean;
  toggleManageUserRolesDialog: () => void;
}

const UserRolesListContext =
  createContext<UserRolesListContextValue>(initialContextValue);

export const UserRolesListProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleManageUserRolesDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_MANAGE_USER_ROLES_DIALOG' }),
    []
  );

  return (
    <UserRolesListContext.Provider
      value={{
        isManageUserRolesDialogOpen: state.isManageUserRolesDialogOpen,
        toggleManageUserRolesDialog: handleToggleManageUserRolesDialog,
      }}
    >
      {children}
    </UserRolesListContext.Provider>
  );
};

export function useUserRolesList(): UserRolesListContextValue {
  return useContext(UserRolesListContext);
}

export default UserRolesListProvider;
