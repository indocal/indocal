import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: UserSuppliesRequestsDataGridContextState = {
  isAddSupplyRequestDialogOpen: false,
};

interface UserSuppliesRequestsDataGridContextState {
  isAddSupplyRequestDialogOpen: boolean;
}

type UserSuppliesRequestsDataGridContextStateAction = {
  type: 'TOGGLE_ADD_SUPPLY_REQUEST_DIALOG';
};

function reducer(
  state: UserSuppliesRequestsDataGridContextState,
  action: UserSuppliesRequestsDataGridContextStateAction
): UserSuppliesRequestsDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_SUPPLY_REQUEST_DIALOG':
      return {
        ...state,
        isAddSupplyRequestDialogOpen: !state.isAddSupplyRequestDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UserSuppliesRequestsDataGridContextValue = {
  isAddSupplyRequestDialogOpen:
    initialContextState.isAddSupplyRequestDialogOpen,
  toggleAddSupplyRequestDialog: () => undefined,
};

export interface UserSuppliesRequestsDataGridContextValue {
  isAddSupplyRequestDialogOpen: boolean;
  toggleAddSupplyRequestDialog: () => void;
}

const UserSuppliesRequestsDataGridContext =
  createContext<UserSuppliesRequestsDataGridContextValue>(initialContextValue);

export const UserSuppliesRequestsDataGridProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddSupplyRequestDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_SUPPLY_REQUEST_DIALOG' }),
    []
  );

  return (
    <UserSuppliesRequestsDataGridContext.Provider
      value={{
        isAddSupplyRequestDialogOpen: state.isAddSupplyRequestDialogOpen,
        toggleAddSupplyRequestDialog: handleToggleAddSupplyRequestDialog,
      }}
    >
      {children}
    </UserSuppliesRequestsDataGridContext.Provider>
  );
};

export function useUserSuppliesRequestsDataGrid(): UserSuppliesRequestsDataGridContextValue {
  return useContext(UserSuppliesRequestsDataGridContext);
}

export default UserSuppliesRequestsDataGridProvider;
