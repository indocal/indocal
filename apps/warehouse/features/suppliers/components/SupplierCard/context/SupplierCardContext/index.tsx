import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: SupplierCardContextState = {
  isEditSupplierDialogOpen: false,
};

interface SupplierCardContextState {
  isEditSupplierDialogOpen: boolean;
}

type SupplierCardContextStateAction = { type: 'TOGGLE_EDIT_SUPPLIER_DIALOG' };

function reducer(
  state: SupplierCardContextState,
  action: SupplierCardContextStateAction
): SupplierCardContextState {
  switch (action.type) {
    case 'TOGGLE_EDIT_SUPPLIER_DIALOG':
      return {
        ...state,
        isEditSupplierDialogOpen: !state.isEditSupplierDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: SupplierCardContextValue = {
  isEditSupplierDialogOpen: initialContextState.isEditSupplierDialogOpen,
  toggleEditSupplierDialog: () => undefined,
};

export interface SupplierCardContextValue {
  isEditSupplierDialogOpen: boolean;
  toggleEditSupplierDialog: () => void;
}

const SupplierCardContext =
  createContext<SupplierCardContextValue>(initialContextValue);

export const SupplierCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditSupplierDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_SUPPLIER_DIALOG' }),
    []
  );

  return (
    <SupplierCardContext.Provider
      value={{
        isEditSupplierDialogOpen: state.isEditSupplierDialogOpen,
        toggleEditSupplierDialog: handleToggleEditSupplierDialog,
      }}
    >
      {children}
    </SupplierCardContext.Provider>
  );
};

export function useSupplierCard(): SupplierCardContextValue {
  return useContext(SupplierCardContext);
}

export default SupplierCardProvider;
