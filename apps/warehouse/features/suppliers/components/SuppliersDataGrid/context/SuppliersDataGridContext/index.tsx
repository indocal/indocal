import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: SuppliersDataGridContextState = {
  isAddSupplierDialogOpen: false,
};

interface SuppliersDataGridContextState {
  isAddSupplierDialogOpen: boolean;
}

type SuppliersDataGridContextStateAction = {
  type: 'TOGGLE_ADD_SUPPLIER_DIALOG';
};

function reducer(
  state: SuppliersDataGridContextState,
  action: SuppliersDataGridContextStateAction
): SuppliersDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_SUPPLIER_DIALOG':
      return {
        ...state,
        isAddSupplierDialogOpen: !state.isAddSupplierDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: SuppliersDataGridContextValue = {
  isAddSupplierDialogOpen: initialContextState.isAddSupplierDialogOpen,
  toggleAddSupplierDialog: () => undefined,
};

export interface SuppliersDataGridContextValue {
  isAddSupplierDialogOpen: boolean;
  toggleAddSupplierDialog: () => void;
}

const SuppliersDataGridContext =
  createContext<SuppliersDataGridContextValue>(initialContextValue);

export const SuppliersDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddSupplierDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_SUPPLIER_DIALOG' }),
    []
  );

  return (
    <SuppliersDataGridContext.Provider
      value={{
        isAddSupplierDialogOpen: state.isAddSupplierDialogOpen,
        toggleAddSupplierDialog: handleToggleAddSupplierDialog,
      }}
    >
      {children}
    </SuppliersDataGridContext.Provider>
  );
};

export function useSuppliersDataGrid(): SuppliersDataGridContextValue {
  return useContext(SuppliersDataGridContext);
}

export default SuppliersDataGridProvider;
