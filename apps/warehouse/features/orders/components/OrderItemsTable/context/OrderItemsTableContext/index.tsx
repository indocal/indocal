import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: OrderItemsTableContextState = {
  isReceiveOrderItemsDialogOpen: false,
};

interface OrderItemsTableContextState {
  isReceiveOrderItemsDialogOpen: boolean;
}

type OrderItemsTableContextStateAction = {
  type: 'TOGGLE_RECEIVE_ORDER_ITEMS_DIALOG';
};

function reducer(
  state: OrderItemsTableContextState,
  action: OrderItemsTableContextStateAction
): OrderItemsTableContextState {
  switch (action.type) {
    case 'TOGGLE_RECEIVE_ORDER_ITEMS_DIALOG':
      return {
        ...state,
        isReceiveOrderItemsDialogOpen: !state.isReceiveOrderItemsDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: OrderItemsTableContextValue = {
  isReceiveOrderItemsDialogOpen:
    initialContextState.isReceiveOrderItemsDialogOpen,
  toggleReceiveOrderItemsDialog: () => undefined,
};

export interface OrderItemsTableContextValue {
  isReceiveOrderItemsDialogOpen: boolean;
  toggleReceiveOrderItemsDialog: () => void;
}

const OrderItemsTableContext =
  createContext<OrderItemsTableContextValue>(initialContextValue);

export const OrderItemsTableProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleReceiveOrderItemsDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_RECEIVE_ORDER_ITEMS_DIALOG' }),
    []
  );

  return (
    <OrderItemsTableContext.Provider
      value={{
        isReceiveOrderItemsDialogOpen: state.isReceiveOrderItemsDialogOpen,
        toggleReceiveOrderItemsDialog: handleToggleReceiveOrderItemsDialog,
      }}
    >
      {children}
    </OrderItemsTableContext.Provider>
  );
};

export function useOrderItemsTable(): OrderItemsTableContextValue {
  return useContext(OrderItemsTableContext);
}

export default OrderItemsTableProvider;
