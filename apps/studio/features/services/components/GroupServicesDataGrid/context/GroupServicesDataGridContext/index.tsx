import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: GroupServicesDataGridContextState = {
  isAddServiceDialogOpen: false,
};

interface GroupServicesDataGridContextState {
  isAddServiceDialogOpen: boolean;
}

type GroupServicesDataGridContextStateAction = {
  type: 'TOGGLE_ADD_SERVICE_DIALOG';
};

function reducer(
  state: GroupServicesDataGridContextState,
  action: GroupServicesDataGridContextStateAction
): GroupServicesDataGridContextState {
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

export const initialContextValue: GroupServicesDataGridContextValue = {
  isAddServiceDialogOpen: initialContextState.isAddServiceDialogOpen,
  toggleAddServiceDialog: () => undefined,
};

export interface GroupServicesDataGridContextValue {
  isAddServiceDialogOpen: boolean;
  toggleAddServiceDialog: () => void;
}

const GroupServicesDataGridContext =
  createContext<GroupServicesDataGridContextValue>(initialContextValue);

export const GroupServicesDataGridProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddServiceDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_SERVICE_DIALOG' }),
    []
  );

  return (
    <GroupServicesDataGridContext.Provider
      value={{
        isAddServiceDialogOpen: state.isAddServiceDialogOpen,
        toggleAddServiceDialog: handleToggleAddServiceDialog,
      }}
    >
      {children}
    </GroupServicesDataGridContext.Provider>
  );
};

export function useGroupServicesDataGrid(): GroupServicesDataGridContextValue {
  return useContext(GroupServicesDataGridContext);
}

export default GroupServicesDataGridProvider;
