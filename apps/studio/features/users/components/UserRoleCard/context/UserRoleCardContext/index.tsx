import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: UserRoleCardContextState = {
  isEditUserRoleDialogOpen: false,
};

interface UserRoleCardContextState {
  isEditUserRoleDialogOpen: boolean;
}

type UserRoleCardContextStateAction = {
  type: 'TOGGLE_EDIT_USER_ROLE_DIALOG';
};

function reducer(
  state: UserRoleCardContextState,
  action: UserRoleCardContextStateAction
): UserRoleCardContextState {
  switch (action.type) {
    case 'TOGGLE_EDIT_USER_ROLE_DIALOG':
      return {
        ...state,
        isEditUserRoleDialogOpen: !state.isEditUserRoleDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UserRoleCardContextValue = {
  isEditUserRoleDialogOpen: initialContextState.isEditUserRoleDialogOpen,
  toggleEditUserRoleDialog: () => undefined,
};

export interface UserRoleCardContextValue {
  isEditUserRoleDialogOpen: boolean;
  toggleEditUserRoleDialog: () => void;
}

const UserRoleCardContext =
  createContext<UserRoleCardContextValue>(initialContextValue);

export const UserRoleCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditUserRoleDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_USER_ROLE_DIALOG' }),
    []
  );

  return (
    <UserRoleCardContext.Provider
      value={{
        isEditUserRoleDialogOpen: state.isEditUserRoleDialogOpen,
        toggleEditUserRoleDialog: handleToggleEditUserRoleDialog,
      }}
    >
      {children}
    </UserRoleCardContext.Provider>
  );
};

export function useUserRoleCard(): UserRoleCardContextValue {
  return useContext(UserRoleCardContext);
}

export default UserRoleCardProvider;
