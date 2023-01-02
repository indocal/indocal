import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: SupplyCardContextState = {
  isEditSupplyDialogOpen: false,
};

interface SupplyCardContextState {
  isEditSupplyDialogOpen: boolean;
}

type SupplyCardContextStateAction = { type: 'TOGGLE_EDIT_SUPPLY_DIALOG' };

function reducer(
  state: SupplyCardContextState,
  action: SupplyCardContextStateAction
): SupplyCardContextState {
  switch (action.type) {
    case 'TOGGLE_EDIT_SUPPLY_DIALOG':
      return {
        ...state,
        isEditSupplyDialogOpen: !state.isEditSupplyDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: SupplyCardContextValue = {
  isEditSupplyDialogOpen: initialContextState.isEditSupplyDialogOpen,
  toggleEditSupplyDialog: () => undefined,
};

export interface SupplyCardContextValue {
  isEditSupplyDialogOpen: boolean;
  toggleEditSupplyDialog: () => void;
}

const SupplyCardContext =
  createContext<SupplyCardContextValue>(initialContextValue);

export const SupplyCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditSupplyDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_SUPPLY_DIALOG' }),
    []
  );

  return (
    <SupplyCardContext.Provider
      value={{
        isEditSupplyDialogOpen: state.isEditSupplyDialogOpen,
        toggleEditSupplyDialog: handleToggleEditSupplyDialog,
      }}
    >
      {children}
    </SupplyCardContext.Provider>
  );
};

export function useSupplyCard(): SupplyCardContextValue {
  return useContext(SupplyCardContext);
}

export default SupplyCardProvider;
