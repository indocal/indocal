import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: ServiceRequestStepperContextState = {
  isUpdateCurrentStepDialogOpen: false,
};

interface ServiceRequestStepperContextState {
  isUpdateCurrentStepDialogOpen: boolean;
}

type ServiceRequestStepperContextStateAction = {
  type: 'TOGGLE_UPDATE_CURRENT_STEP_DIALOG';
};

function reducer(
  state: ServiceRequestStepperContextState,
  action: ServiceRequestStepperContextStateAction
): ServiceRequestStepperContextState {
  switch (action.type) {
    case 'TOGGLE_UPDATE_CURRENT_STEP_DIALOG':
      return {
        ...state,
        isUpdateCurrentStepDialogOpen: !state.isUpdateCurrentStepDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: ServiceRequestStepperContextValue = {
  isUpdateCurrentStepDialogOpen:
    initialContextState.isUpdateCurrentStepDialogOpen,
  toggleUpdateCurrentStepDialog: () => undefined,
};

export interface ServiceRequestStepperContextValue {
  isUpdateCurrentStepDialogOpen: boolean;
  toggleUpdateCurrentStepDialog: () => void;
}

const ServiceRequestStepperContext =
  createContext<ServiceRequestStepperContextValue>(initialContextValue);

export const ServiceRequestStepperProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleUpdateCurrentStepDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_UPDATE_CURRENT_STEP_DIALOG' }),
    []
  );

  return (
    <ServiceRequestStepperContext.Provider
      value={{
        isUpdateCurrentStepDialogOpen: state.isUpdateCurrentStepDialogOpen,
        toggleUpdateCurrentStepDialog: handleToggleUpdateCurrentStepDialog,
      }}
    >
      {children}
    </ServiceRequestStepperContext.Provider>
  );
};

export function useServiceRequestStepper(): ServiceRequestStepperContextValue {
  return useContext(ServiceRequestStepperContext);
}

export default ServiceRequestStepperProvider;
