import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: ServiceCardContextState = {
  isEditServiceDialogOpen: false,
};

interface ServiceCardContextState {
  isEditServiceDialogOpen: boolean;
}

type ServiceCardContextStateAction = {
  type: 'TOGGLE_EDIT_SERVICE_DIALOG';
};

function reducer(
  state: ServiceCardContextState,
  action: ServiceCardContextStateAction
): ServiceCardContextState {
  switch (action.type) {
    case 'TOGGLE_EDIT_SERVICE_DIALOG':
      return {
        ...state,
        isEditServiceDialogOpen: !state.isEditServiceDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: ServiceCardContextValue = {
  isEditServiceDialogOpen: initialContextState.isEditServiceDialogOpen,
  toggleEditServiceDialog: () => undefined,
};

export interface ServiceCardContextValue {
  isEditServiceDialogOpen: boolean;
  toggleEditServiceDialog: () => void;
}

const ServiceCardContext =
  createContext<ServiceCardContextValue>(initialContextValue);

export const ServiceCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditServiceDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_SERVICE_DIALOG' }),
    []
  );

  return (
    <ServiceCardContext.Provider
      value={{
        isEditServiceDialogOpen: state.isEditServiceDialogOpen,
        toggleEditServiceDialog: handleToggleEditServiceDialog,
      }}
    >
      {children}
    </ServiceCardContext.Provider>
  );
};

export function useServiceCard(): ServiceCardContextValue {
  return useContext(ServiceCardContext);
}

export default ServiceCardProvider;
