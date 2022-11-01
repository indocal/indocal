import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: UserCardContextState = {
  isEditUserDialogOpen: false,
};

interface UserCardContextState {
  isEditUserDialogOpen: boolean;
}

type UserCardContextStateAction = {
  type: 'TOGGLE_EDIT_USER_DIALOG';
};

function reducer(
  state: UserCardContextState,
  action: UserCardContextStateAction
): UserCardContextState {
  switch (action.type) {
    case 'TOGGLE_EDIT_USER_DIALOG':
      return {
        ...state,
        isEditUserDialogOpen: !state.isEditUserDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UserCardContextValue = {
  isEditUserDialogOpen: initialContextState.isEditUserDialogOpen,
  toggleEditUserDialog: () => undefined,
};

export interface UserCardContextValue {
  isEditUserDialogOpen: boolean;
  toggleEditUserDialog: () => void;
}

const UserCardContext =
  createContext<UserCardContextValue>(initialContextValue);

export const UserCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditUserDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_USER_DIALOG' }),
    []
  );

  return (
    <UserCardContext.Provider
      value={{
        isEditUserDialogOpen: state.isEditUserDialogOpen,
        toggleEditUserDialog: handleToggleEditUserDialog,
      }}
    >
      {children}
    </UserCardContext.Provider>
  );
};

export function useUserCard(): UserCardContextValue {
  return useContext(UserCardContext);
}

export default UserCardProvider;
