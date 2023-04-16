import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: FormCardContextState = {
  isAddEntryDialogOpen: false,
};

interface FormCardContextState {
  isAddEntryDialogOpen: boolean;
}

type FormCardContextStateAction = {
  type: 'TOGGLE_ADD_ENTRY_DIALOG';
};

function reducer(
  state: FormCardContextState,
  action: FormCardContextStateAction
): FormCardContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_ENTRY_DIALOG':
      return {
        ...state,
        isAddEntryDialogOpen: !state.isAddEntryDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: FormCardContextValue = {
  isAddEntryDialogOpen: initialContextState.isAddEntryDialogOpen,
  toggleAddEntryDialog: () => undefined,
};

export interface FormCardContextValue {
  isAddEntryDialogOpen: boolean;
  toggleAddEntryDialog: () => void;
}

const FormCardContext =
  createContext<FormCardContextValue>(initialContextValue);

export const FormCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddEntryDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_ENTRY_DIALOG' }),
    []
  );

  return (
    <FormCardContext.Provider
      value={{
        isAddEntryDialogOpen: state.isAddEntryDialogOpen,
        toggleAddEntryDialog: handleToggleAddEntryDialog,
      }}
    >
      {children}
    </FormCardContext.Provider>
  );
};

export function useFormCard(): FormCardContextValue {
  return useContext(FormCardContext);
}

export default FormCardProvider;
