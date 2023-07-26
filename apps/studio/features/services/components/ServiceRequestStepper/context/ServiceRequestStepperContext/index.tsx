import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: ServiceRequestStepperContextState = {
  isUpdateCurrentStepDialogOpen: false,
  isGenerateCertificateDialogOpen: false,
  isManageCertificatesDialogOpen: false,
};

interface ServiceRequestStepperContextState {
  isUpdateCurrentStepDialogOpen: boolean;
  isGenerateCertificateDialogOpen: boolean;
  isManageCertificatesDialogOpen: boolean;
}

type ServiceRequestStepperContextStateAction =
  | { type: 'TOGGLE_UPDATE_CURRENT_STEP_DIALOG' }
  | { type: 'TOGGLE_GENERATE_CERTIFICATE_DIALOG' }
  | { type: 'TOGGLE_MANAGE_CERTIFICATES_DIALOG' };

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

    case 'TOGGLE_GENERATE_CERTIFICATE_DIALOG':
      return {
        ...state,
        isGenerateCertificateDialogOpen: !state.isGenerateCertificateDialogOpen,
      };

    case 'TOGGLE_MANAGE_CERTIFICATES_DIALOG':
      return {
        ...state,
        isManageCertificatesDialogOpen: !state.isManageCertificatesDialogOpen,
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

  isGenerateCertificateDialogOpen:
    initialContextState.isGenerateCertificateDialogOpen,
  toggleGenerateCertificateDialog: () => undefined,

  isManageCertificatesDialogOpen:
    initialContextState.isManageCertificatesDialogOpen,
  toggleManageCertificatesDialog: () => undefined,
};

export interface ServiceRequestStepperContextValue {
  isUpdateCurrentStepDialogOpen: boolean;
  toggleUpdateCurrentStepDialog: () => void;

  isGenerateCertificateDialogOpen: boolean;
  toggleGenerateCertificateDialog: () => void;

  isManageCertificatesDialogOpen: boolean;
  toggleManageCertificatesDialog: () => void;
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

  const handleToggleGenerateCertificateDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_GENERATE_CERTIFICATE_DIALOG' }),
    []
  );

  const handleToggleManageCertificatesDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_MANAGE_CERTIFICATES_DIALOG' }),
    []
  );

  return (
    <ServiceRequestStepperContext.Provider
      value={{
        isUpdateCurrentStepDialogOpen: state.isUpdateCurrentStepDialogOpen,
        toggleUpdateCurrentStepDialog: handleToggleUpdateCurrentStepDialog,

        isGenerateCertificateDialogOpen: state.isGenerateCertificateDialogOpen,
        toggleGenerateCertificateDialog: handleToggleGenerateCertificateDialog,

        isManageCertificatesDialogOpen: state.isManageCertificatesDialogOpen,
        toggleManageCertificatesDialog: handleToggleManageCertificatesDialog,
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
