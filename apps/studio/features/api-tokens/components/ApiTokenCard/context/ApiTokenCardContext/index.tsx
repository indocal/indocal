import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: ApiTokenCardContextState = {
  isEditApiTokenDialogOpen: false,
};

interface ApiTokenCardContextState {
  isEditApiTokenDialogOpen: boolean;
}

type ApiTokenCardContextStateAction = {
  type: 'TOGGLE_EDIT_API_TOKEN_DIALOG';
};

function reducer(
  state: ApiTokenCardContextState,
  action: ApiTokenCardContextStateAction
): ApiTokenCardContextState {
  switch (action.type) {
    case 'TOGGLE_EDIT_API_TOKEN_DIALOG':
      return {
        ...state,
        isEditApiTokenDialogOpen: !state.isEditApiTokenDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: ApiTokenCardContextValue = {
  isEditApiTokenDialogOpen: initialContextState.isEditApiTokenDialogOpen,
  toggleEditApiTokenDialog: () => undefined,
};

export interface ApiTokenCardContextValue {
  isEditApiTokenDialogOpen: boolean;
  toggleEditApiTokenDialog: () => void;
}

const ApiTokenCardContext =
  createContext<ApiTokenCardContextValue>(initialContextValue);

export const ApiTokenCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditApiTokenDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_API_TOKEN_DIALOG' }),
    []
  );

  return (
    <ApiTokenCardContext.Provider
      value={{
        isEditApiTokenDialogOpen: state.isEditApiTokenDialogOpen,
        toggleEditApiTokenDialog: handleToggleEditApiTokenDialog,
      }}
    >
      {children}
    </ApiTokenCardContext.Provider>
  );
};

export function useApiTokenCard(): ApiTokenCardContextValue {
  return useContext(ApiTokenCardContext);
}

export default ApiTokenCardProvider;
