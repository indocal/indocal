import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: SupplyRequestItemsTableContextState = {
  isDispatchSupplyRequestItemsDialogOpen: false,
};

interface SupplyRequestItemsTableContextState {
  isDispatchSupplyRequestItemsDialogOpen: boolean;
}

type SupplyRequestItemsTableContextStateAction = {
  type: 'TOGGLE_DISPATCH_SUPPLY_REQUEST_ITEMS_DIALOG';
};

function reducer(
  state: SupplyRequestItemsTableContextState,
  action: SupplyRequestItemsTableContextStateAction
): SupplyRequestItemsTableContextState {
  switch (action.type) {
    case 'TOGGLE_DISPATCH_SUPPLY_REQUEST_ITEMS_DIALOG':
      return {
        ...state,
        isDispatchSupplyRequestItemsDialogOpen:
          !state.isDispatchSupplyRequestItemsDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: SupplyRequestItemsTableContextValue = {
  isDispatchSupplyRequestItemsDialogOpen:
    initialContextState.isDispatchSupplyRequestItemsDialogOpen,
  toggleDispatchSupplyRequestItemsDialog: () => undefined,
};

export interface SupplyRequestItemsTableContextValue {
  isDispatchSupplyRequestItemsDialogOpen: boolean;
  toggleDispatchSupplyRequestItemsDialog: () => void;
}

const SupplyRequestItemsTableContext =
  createContext<SupplyRequestItemsTableContextValue>(initialContextValue);

export const SupplyRequestItemsTableProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleDispatchSupplyRequestItemsDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_DISPATCH_SUPPLY_REQUEST_ITEMS_DIALOG' }),
    []
  );

  return (
    <SupplyRequestItemsTableContext.Provider
      value={{
        isDispatchSupplyRequestItemsDialogOpen:
          state.isDispatchSupplyRequestItemsDialogOpen,
        toggleDispatchSupplyRequestItemsDialog:
          handleToggleDispatchSupplyRequestItemsDialog,
      }}
    >
      {children}
    </SupplyRequestItemsTableContext.Provider>
  );
};

export function useSupplyRequestItemsTable(): SupplyRequestItemsTableContextValue {
  return useContext(SupplyRequestItemsTableContext);
}

export default SupplyRequestItemsTableProvider;
