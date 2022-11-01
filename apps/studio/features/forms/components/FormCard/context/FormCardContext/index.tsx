import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: FormCardContextState = {
  isEditFormDialogOpen: false,
};

interface FormCardContextState {
  isEditFormDialogOpen: boolean;
}

type FormCardContextStateAction = {
  type: 'TOGGLE_EDIT_FORM_DIALOG';
};

function reducer(
  state: FormCardContextState,
  action: FormCardContextStateAction
): FormCardContextState {
  switch (action.type) {
    case 'TOGGLE_EDIT_FORM_DIALOG':
      return {
        ...state,
        isEditFormDialogOpen: !state.isEditFormDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: FormCardContextValue = {
  isEditFormDialogOpen: initialContextState.isEditFormDialogOpen,
  toggleEditFormDialog: () => undefined,
};

export interface FormCardContextValue {
  isEditFormDialogOpen: boolean;
  toggleEditFormDialog: () => void;
}

const FormCardContext =
  createContext<FormCardContextValue>(initialContextValue);

export const FormCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditFormDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_FORM_DIALOG' }),
    []
  );

  return (
    <FormCardContext.Provider
      value={{
        isEditFormDialogOpen: state.isEditFormDialogOpen,
        toggleEditFormDialog: handleToggleEditFormDialog,
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
