import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: ServiceRequestCardContextState = {
  isEditServiceRequestDialogOpen: false,
};

interface ServiceRequestCardContextState {
  isEditServiceRequestDialogOpen: boolean;
}

type ServiceRequestCardContextStateAction = {
  type: 'TOGGLE_EDIT_SERVICE_REQUEST_DIALOG';
};

function reducer(
  state: ServiceRequestCardContextState,
  action: ServiceRequestCardContextStateAction
): ServiceRequestCardContextState {
  switch (action.type) {
    case 'TOGGLE_EDIT_SERVICE_REQUEST_DIALOG':
      return {
        ...state,
        isEditServiceRequestDialogOpen: !state.isEditServiceRequestDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: ServiceRequestCardContextValue = {
  isEditServiceRequestDialogOpen:
    initialContextState.isEditServiceRequestDialogOpen,
  toggleEditServiceRequestDialog: () => undefined,
};

export interface ServiceRequestCardContextValue {
  isEditServiceRequestDialogOpen: boolean;
  toggleEditServiceRequestDialog: () => void;
}

const ServiceRequestCardContext =
  createContext<ServiceRequestCardContextValue>(initialContextValue);

export const ServiceRequestCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditServiceRequestDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_SERVICE_REQUEST_DIALOG' }),
    []
  );

  return (
    <ServiceRequestCardContext.Provider
      value={{
        isEditServiceRequestDialogOpen: state.isEditServiceRequestDialogOpen,
        toggleEditServiceRequestDialog: handleToggleEditServiceRequestDialog,
      }}
    >
      {children}
    </ServiceRequestCardContext.Provider>
  );
};

export function useServiceRequestCard(): ServiceRequestCardContextValue {
  return useContext(ServiceRequestCardContext);
}

export default ServiceRequestCardProvider;
