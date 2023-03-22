import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: GenericLogsDataGridContextState = {
  isLogDetailsDialogOpen: false,
};

interface GenericLogsDataGridContextState {
  isLogDetailsDialogOpen: boolean;
}

type GenericLogsDataGridContextStateAction = {
  type: 'TOGGLE_LOG_DETAILS_DIALOG';
};

function reducer(
  state: GenericLogsDataGridContextState,
  action: GenericLogsDataGridContextStateAction
): GenericLogsDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_LOG_DETAILS_DIALOG':
      return {
        ...state,
        isLogDetailsDialogOpen: !state.isLogDetailsDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: GenericLogsDataGridContextValue = {
  isLogDetailsDialogOpen: initialContextState.isLogDetailsDialogOpen,
  toggleLogDetailsDialog: () => undefined,
};

export interface GenericLogsDataGridContextValue {
  isLogDetailsDialogOpen: boolean;
  toggleLogDetailsDialog: () => void;
}

const GenericLogsDataGridContext =
  createContext<GenericLogsDataGridContextValue>(initialContextValue);

export const GenericLogsDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleLogDetailsDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_LOG_DETAILS_DIALOG' }),
    []
  );

  return (
    <GenericLogsDataGridContext.Provider
      value={{
        isLogDetailsDialogOpen: state.isLogDetailsDialogOpen,
        toggleLogDetailsDialog: handleToggleLogDetailsDialog,
      }}
    >
      {children}
    </GenericLogsDataGridContext.Provider>
  );
};

export function useGenericLogsDataGrid(): GenericLogsDataGridContextValue {
  return useContext(GenericLogsDataGridContext);
}

export default GenericLogsDataGridProvider;
