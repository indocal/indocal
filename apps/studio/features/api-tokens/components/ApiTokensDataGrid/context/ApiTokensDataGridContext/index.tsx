import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: ApiTokensDataGridContextState = {
  isAddApiTokenDialogOpen: false,
};

interface ApiTokensDataGridContextState {
  isAddApiTokenDialogOpen: boolean;
}

type ApiTokensDataGridContextStateAction = {
  type: 'TOGGLE_ADD_API_TOKEN_DIALOG';
};

function reducer(
  state: ApiTokensDataGridContextState,
  action: ApiTokensDataGridContextStateAction
): ApiTokensDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_API_TOKEN_DIALOG':
      return {
        ...state,
        isAddApiTokenDialogOpen: !state.isAddApiTokenDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: ApiTokensDataGridContextValue = {
  isAddApiTokenDialogOpen: initialContextState.isAddApiTokenDialogOpen,
  toggleAddApiTokenDialog: () => undefined,
};

export interface ApiTokensDataGridContextValue {
  isAddApiTokenDialogOpen: boolean;
  toggleAddApiTokenDialog: () => void;
}

const ApiTokensDataGridContext =
  createContext<ApiTokensDataGridContextValue>(initialContextValue);

export const ApiTokensDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddApiTokenDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_API_TOKEN_DIALOG' }),
    []
  );

  return (
    <ApiTokensDataGridContext.Provider
      value={{
        isAddApiTokenDialogOpen: state.isAddApiTokenDialogOpen,
        toggleAddApiTokenDialog: handleToggleAddApiTokenDialog,
      }}
    >
      {children}
    </ApiTokensDataGridContext.Provider>
  );
};

export function useApiTokensDataGrid(): ApiTokensDataGridContextValue {
  return useContext(ApiTokensDataGridContext);
}

export default ApiTokensDataGridProvider;
