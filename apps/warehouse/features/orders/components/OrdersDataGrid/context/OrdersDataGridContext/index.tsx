import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: OrdersDataGridContextState = {
  isAddOrderDialogOpen: false,
};

interface OrdersDataGridContextState {
  isAddOrderDialogOpen: boolean;
}

type OrdersDataGridContextStateAction = {
  type: 'TOGGLE_ADD_ORDER_DIALOG';
};

function reducer(
  state: OrdersDataGridContextState,
  action: OrdersDataGridContextStateAction
): OrdersDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_ORDER_DIALOG':
      return {
        ...state,
        isAddOrderDialogOpen: !state.isAddOrderDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: OrdersDataGridContextValue = {
  isAddOrderDialogOpen: initialContextState.isAddOrderDialogOpen,
  toggleAddOrderDialog: () => undefined,
};

export interface OrdersDataGridContextValue {
  isAddOrderDialogOpen: boolean;
  toggleAddOrderDialog: () => void;
}

const OrdersDataGridContext =
  createContext<OrdersDataGridContextValue>(initialContextValue);

export const OrdersDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddOrderDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_ORDER_DIALOG' }),
    []
  );

  return (
    <OrdersDataGridContext.Provider
      value={{
        isAddOrderDialogOpen: state.isAddOrderDialogOpen,
        toggleAddOrderDialog: handleToggleAddOrderDialog,
      }}
    >
      {children}
    </OrdersDataGridContext.Provider>
  );
};

export function useOrdersDataGrid(): OrdersDataGridContextValue {
  return useContext(OrdersDataGridContext);
}

export default OrdersDataGridProvider;
