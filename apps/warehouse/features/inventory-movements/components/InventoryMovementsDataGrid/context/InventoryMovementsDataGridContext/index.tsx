import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: InventoryMovementsDataGridContextState = {
  isAddInventoryMovementDialogOpen: false,
};

interface InventoryMovementsDataGridContextState {
  isAddInventoryMovementDialogOpen: boolean;
}

type InventoryMovementsDataGridContextStateAction = {
  type: 'TOGGLE_ADD_INVENTORY_MOVEMENT_DIALOG';
};

function reducer(
  state: InventoryMovementsDataGridContextState,
  action: InventoryMovementsDataGridContextStateAction
): InventoryMovementsDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_INVENTORY_MOVEMENT_DIALOG':
      return {
        ...state,
        isAddInventoryMovementDialogOpen:
          !state.isAddInventoryMovementDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: InventoryMovementsDataGridContextValue = {
  isAddInventoryMovementDialogOpen:
    initialContextState.isAddInventoryMovementDialogOpen,
  toggleAddInventoryMovementDialog: () => undefined,
};

export interface InventoryMovementsDataGridContextValue {
  isAddInventoryMovementDialogOpen: boolean;
  toggleAddInventoryMovementDialog: () => void;
}

const InventoryMovementsDataGridContext =
  createContext<InventoryMovementsDataGridContextValue>(initialContextValue);

export const InventoryMovementsDataGridProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddInventoryMovementDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_INVENTORY_MOVEMENT_DIALOG' }),
    []
  );

  return (
    <InventoryMovementsDataGridContext.Provider
      value={{
        isAddInventoryMovementDialogOpen:
          state.isAddInventoryMovementDialogOpen,
        toggleAddInventoryMovementDialog:
          handleToggleAddInventoryMovementDialog,
      }}
    >
      {children}
    </InventoryMovementsDataGridContext.Provider>
  );
};

export function useInventoryMovementsDataGrid(): InventoryMovementsDataGridContextValue {
  return useContext(InventoryMovementsDataGridContext);
}

export default InventoryMovementsDataGridProvider;
