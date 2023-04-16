import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: ServicesDataGridContextState = {
  isAddServiceDialogOpen: false,
};

interface ServicesDataGridContextState {
  isAddServiceDialogOpen: boolean;
}

type ServicesDataGridContextStateAction = {
  type: 'TOGGLE_ADD_SERVICE_DIALOG';
};

function reducer(
  state: ServicesDataGridContextState,
  action: ServicesDataGridContextStateAction
): ServicesDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_SERVICE_DIALOG':
      return {
        ...state,
        isAddServiceDialogOpen: !state.isAddServiceDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: ServicesDataGridContextValue = {
  isAddServiceDialogOpen: initialContextState.isAddServiceDialogOpen,
  toggleAddServiceDialog: () => undefined,
};

export interface ServicesDataGridContextValue {
  isAddServiceDialogOpen: boolean;
  toggleAddServiceDialog: () => void;
}

const ServicesDataGridContext =
  createContext<ServicesDataGridContextValue>(initialContextValue);

export const ServicesDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddServiceDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_SERVICE_DIALOG' }),
    []
  );

  return (
    <ServicesDataGridContext.Provider
      value={{
        isAddServiceDialogOpen: state.isAddServiceDialogOpen,
        toggleAddServiceDialog: handleToggleAddServiceDialog,
      }}
    >
      {children}
    </ServicesDataGridContext.Provider>
  );
};

export function useServicesDataGrid(): ServicesDataGridContextValue {
  return useContext(ServicesDataGridContext);
}

export default ServicesDataGridProvider;
