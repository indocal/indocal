import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: FormsDataGridContextState = {
  isAddFormDialogOpen: false,
};

interface FormsDataGridContextState {
  isAddFormDialogOpen: boolean;
}

type FormsDataGridContextStateAction = {
  type: 'TOGGLE_ADD_FORM_DIALOG';
};

function reducer(
  state: FormsDataGridContextState,
  action: FormsDataGridContextStateAction
): FormsDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_FORM_DIALOG':
      return {
        ...state,
        isAddFormDialogOpen: !state.isAddFormDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: FormsDataGridContextValue = {
  isAddFormDialogOpen: initialContextState.isAddFormDialogOpen,
  toggleAddFormDialog: () => undefined,
};

export interface FormsDataGridContextValue {
  isAddFormDialogOpen: boolean;
  toggleAddFormDialog: () => void;
}

const FormsDataGridContext =
  createContext<FormsDataGridContextValue>(initialContextValue);

export const FormsDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddFormDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_FORM_DIALOG' }),
    []
  );

  return (
    <FormsDataGridContext.Provider
      value={{
        isAddFormDialogOpen: state.isAddFormDialogOpen,
        toggleAddFormDialog: handleToggleAddFormDialog,
      }}
    >
      {children}
    </FormsDataGridContext.Provider>
  );
};

export function useFormsDataGrid(): FormsDataGridContextValue {
  return useContext(FormsDataGridContext);
}

export default FormsDataGridProvider;
