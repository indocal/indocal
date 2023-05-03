import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: ServiceCardContextState = {
  isEditServiceDialogOpen: false,
  isManageServiceProcessDialogOpen: false,
  isAddServiceProcessStepDialogOpen: false,
  isEditServiceProcessStepDialogOpen: false,
};

interface ServiceCardContextState {
  isEditServiceDialogOpen: boolean;
  isManageServiceProcessDialogOpen: boolean;
  isAddServiceProcessStepDialogOpen: boolean;
  isEditServiceProcessStepDialogOpen: boolean;
}

type ServiceCardContextStateAction =
  | { type: 'TOGGLE_EDIT_SERVICE_DIALOG' }
  | { type: 'TOGGLE_MANAGE_SERVICE_PROCESS_DIALOG' }
  | { type: 'TOGGLE_ADD_SERVICE_PROCESS_STEP_DIALOG' }
  | { type: 'TOGGLE_EDIT_SERVICE_PROCESS_STEP_DIALOG' };

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

    case 'TOGGLE_MANAGE_SERVICE_PROCESS_DIALOG':
      return {
        ...state,
        isManageServiceProcessDialogOpen:
          !state.isManageServiceProcessDialogOpen,
      };

    case 'TOGGLE_ADD_SERVICE_PROCESS_STEP_DIALOG':
      return {
        ...state,
        isAddServiceProcessStepDialogOpen:
          !state.isAddServiceProcessStepDialogOpen,
      };

    case 'TOGGLE_EDIT_SERVICE_PROCESS_STEP_DIALOG':
      return {
        ...state,
        isEditServiceProcessStepDialogOpen:
          !state.isEditServiceProcessStepDialogOpen,
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

  isManageServiceProcessDialogOpen:
    initialContextState.isManageServiceProcessDialogOpen,
  toggleManageServiceProcessDialog: () => undefined,

  isAddServiceProcessStepDialogOpen:
    initialContextState.isAddServiceProcessStepDialogOpen,
  toggleAddServiceProcessStepDialog: () => undefined,

  isEditServiceProcessStepDialogOpen:
    initialContextState.isEditServiceProcessStepDialogOpen,
  toggleEditServiceProcessStepDialog: () => undefined,
};

export interface ServiceCardContextValue {
  isEditServiceDialogOpen: boolean;
  toggleEditServiceDialog: () => void;

  isManageServiceProcessDialogOpen: boolean;
  toggleManageServiceProcessDialog: () => void;

  isAddServiceProcessStepDialogOpen: boolean;
  toggleAddServiceProcessStepDialog: () => void;

  isEditServiceProcessStepDialogOpen: boolean;
  toggleEditServiceProcessStepDialog: () => void;
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

  const handleToggleManageServiceProcessDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_MANAGE_SERVICE_PROCESS_DIALOG' }),
    []
  );

  const handleToggleAddServiceProcessStepDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_SERVICE_PROCESS_STEP_DIALOG' }),
    []
  );

  const handleToggleEditServiceProcessStepDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_SERVICE_PROCESS_STEP_DIALOG' }),
    []
  );

  return (
    <ServiceCardContext.Provider
      value={{
        isEditServiceDialogOpen: state.isEditServiceDialogOpen,
        toggleEditServiceDialog: handleToggleEditServiceDialog,

        isManageServiceProcessDialogOpen:
          state.isManageServiceProcessDialogOpen,
        toggleManageServiceProcessDialog:
          handleToggleManageServiceProcessDialog,

        isAddServiceProcessStepDialogOpen:
          state.isAddServiceProcessStepDialogOpen,
        toggleAddServiceProcessStepDialog:
          handleToggleAddServiceProcessStepDialog,

        isEditServiceProcessStepDialogOpen:
          state.isEditServiceProcessStepDialogOpen,
        toggleEditServiceProcessStepDialog:
          handleToggleEditServiceProcessStepDialog,
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
