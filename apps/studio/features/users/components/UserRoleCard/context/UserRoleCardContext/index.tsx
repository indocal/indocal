import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: UserRoleCardContextState = {
  isEditUserRoleDialogOpen: false,
  isManageUserRoleConfigDialogOpen: false,
};

interface UserRoleCardContextState {
  isEditUserRoleDialogOpen: boolean;
  isManageUserRoleConfigDialogOpen: boolean;
}

type UserRoleCardContextStateAction =
  | { type: 'TOGGLE_EDIT_USER_ROLE_DIALOG' }
  | { type: 'TOGGLE_MANAGE_USER_ROLE_CONFIG_DIALOG' };

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

    case 'TOGGLE_MANAGE_USER_ROLE_CONFIG_DIALOG':
      return {
        ...state,
        isManageUserRoleConfigDialogOpen:
          !state.isManageUserRoleConfigDialogOpen,
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
  isManageUserRoleConfigDialogOpen:
    initialContextState.isManageUserRoleConfigDialogOpen,

  toggleEditUserRoleDialog: () => undefined,
  toggleManageUserRoleConfigDialog: () => undefined,
};

export interface UserRoleCardContextValue {
  isEditUserRoleDialogOpen: boolean;
  isManageUserRoleConfigDialogOpen: boolean;
  toggleEditUserRoleDialog: () => void;
  toggleManageUserRoleConfigDialog: () => void;
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

  const handleToggleManageUserRoleConfigDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_MANAGE_USER_ROLE_CONFIG_DIALOG' }),
    []
  );

  return (
    <UserRoleCardContext.Provider
      value={{
        isEditUserRoleDialogOpen: state.isEditUserRoleDialogOpen,
        isManageUserRoleConfigDialogOpen:
          state.isManageUserRoleConfigDialogOpen,

        toggleEditUserRoleDialog: handleToggleEditUserRoleDialog,
        toggleManageUserRoleConfigDialog:
          handleToggleManageUserRoleConfigDialog,
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
