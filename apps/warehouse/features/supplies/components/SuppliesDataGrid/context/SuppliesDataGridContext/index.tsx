import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: SuppliesDataGridContextState = {
  isAddSupplyDialogOpen: false,
};

interface SuppliesDataGridContextState {
  isAddSupplyDialogOpen: boolean;
}

type SuppliesDataGridContextStateAction = {
  type: 'TOGGLE_ADD_SUPPLY_DIALOG';
};

function reducer(
  state: SuppliesDataGridContextState,
  action: SuppliesDataGridContextStateAction
): SuppliesDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_SUPPLY_DIALOG':
      return {
        ...state,
        isAddSupplyDialogOpen: !state.isAddSupplyDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: SuppliesDataGridContextValue = {
  isAddSupplyDialogOpen: initialContextState.isAddSupplyDialogOpen,
  toggleAddSupplyDialog: () => undefined,
};

export interface SuppliesDataGridContextValue {
  isAddSupplyDialogOpen: boolean;
  toggleAddSupplyDialog: () => void;
}

const SuppliesDataGridContext =
  createContext<SuppliesDataGridContextValue>(initialContextValue);

export const SuppliesDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddSupplyDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_SUPPLY_DIALOG' }),
    []
  );

  return (
    <SuppliesDataGridContext.Provider
      value={{
        isAddSupplyDialogOpen: state.isAddSupplyDialogOpen,
        toggleAddSupplyDialog: handleToggleAddSupplyDialog,
      }}
    >
      {children}
    </SuppliesDataGridContext.Provider>
  );
};

export function useSuppliesDataGrid(): SuppliesDataGridContextValue {
  return useContext(SuppliesDataGridContext);
}

export default SuppliesDataGridProvider;
