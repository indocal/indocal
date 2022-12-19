import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: FormCardContextState = {
  isEditFormDialogOpen: false,
  isManageFormConfigDialogOpen: false,
};

interface FormCardContextState {
  isEditFormDialogOpen: boolean;
  isManageFormConfigDialogOpen: boolean;
}

type FormCardContextStateAction =
  | { type: 'TOGGLE_EDIT_FORM_DIALOG' }
  | { type: 'TOGGLE_MANAGE_FORM_CONFIG_DIALOG' };

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

    case 'TOGGLE_MANAGE_FORM_CONFIG_DIALOG':
      return {
        ...state,
        isManageFormConfigDialogOpen: !state.isManageFormConfigDialogOpen,
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
  isManageFormConfigDialogOpen:
    initialContextState.isManageFormConfigDialogOpen,

  toggleEditFormDialog: () => undefined,
  toggleManageFormConfigDialog: () => undefined,
};

export interface FormCardContextValue {
  isEditFormDialogOpen: boolean;
  isManageFormConfigDialogOpen: boolean;
  toggleEditFormDialog: () => void;
  toggleManageFormConfigDialog: () => void;
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

  const handleToggleManageFormConfigDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_MANAGE_FORM_CONFIG_DIALOG' }),
    []
  );

  return (
    <FormCardContext.Provider
      value={{
        isEditFormDialogOpen: state.isEditFormDialogOpen,
        isManageFormConfigDialogOpen: state.isManageFormConfigDialogOpen,

        toggleEditFormDialog: handleToggleEditFormDialog,
        toggleManageFormConfigDialog: handleToggleManageFormConfigDialog,
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
