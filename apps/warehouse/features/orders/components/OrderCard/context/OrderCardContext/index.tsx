import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: OrderCardContextState = {
  isEditOrderDialogOpen: false,
};

interface OrderCardContextState {
  isEditOrderDialogOpen: boolean;
}

type OrderCardContextStateAction = { type: 'TOGGLE_EDIT_ORDER_DIALOG' };

function reducer(
  state: OrderCardContextState,
  action: OrderCardContextStateAction
): OrderCardContextState {
  switch (action.type) {
    case 'TOGGLE_EDIT_ORDER_DIALOG':
      return {
        ...state,
        isEditOrderDialogOpen: !state.isEditOrderDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: OrderCardContextValue = {
  isEditOrderDialogOpen: initialContextState.isEditOrderDialogOpen,
  toggleEditOrderDialog: () => undefined,
};

export interface OrderCardContextValue {
  isEditOrderDialogOpen: boolean;
  toggleEditOrderDialog: () => void;
}

const OrderCardContext =
  createContext<OrderCardContextValue>(initialContextValue);

export const OrderCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditOrderDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_ORDER_DIALOG' }),
    []
  );

  return (
    <OrderCardContext.Provider
      value={{
        isEditOrderDialogOpen: state.isEditOrderDialogOpen,
        toggleEditOrderDialog: handleToggleEditOrderDialog,
      }}
    >
      {children}
    </OrderCardContext.Provider>
  );
};

export function useOrderCard(): OrderCardContextValue {
  return useContext(OrderCardContext);
}

export default OrderCardProvider;
