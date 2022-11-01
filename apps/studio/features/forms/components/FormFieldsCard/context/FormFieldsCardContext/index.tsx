import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: FormFieldsCardContextState = {
  isManageFormFieldsDialogOpen: false,
};

interface FormFieldsCardContextState {
  isManageFormFieldsDialogOpen: boolean;
}

type FormFieldsCardContextStateAction = {
  type: 'TOGGLE_MANAGE_FORM_FIELDS_DIALOG';
};

function reducer(
  state: FormFieldsCardContextState,
  action: FormFieldsCardContextStateAction
): FormFieldsCardContextState {
  switch (action.type) {
    case 'TOGGLE_MANAGE_FORM_FIELDS_DIALOG':
      return {
        ...state,
        isManageFormFieldsDialogOpen: !state.isManageFormFieldsDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: FormFieldsCardContextValue = {
  isManageFormFieldsDialogOpen:
    initialContextState.isManageFormFieldsDialogOpen,
  toggleManageFormFieldsDialog: () => undefined,
};

export interface FormFieldsCardContextValue {
  isManageFormFieldsDialogOpen: boolean;
  toggleManageFormFieldsDialog: () => void;
}

const FormFieldsCardContext =
  createContext<FormFieldsCardContextValue>(initialContextValue);

export const FormFieldsCardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleManageFormFieldsDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_MANAGE_FORM_FIELDS_DIALOG' }),
    []
  );

  return (
    <FormFieldsCardContext.Provider
      value={{
        isManageFormFieldsDialogOpen: state.isManageFormFieldsDialogOpen,
        toggleManageFormFieldsDialog: handleToggleManageFormFieldsDialog,
      }}
    >
      {children}
    </FormFieldsCardContext.Provider>
  );
};

export function useFormFieldsCard(): FormFieldsCardContextValue {
  return useContext(FormFieldsCardContext);
}

export default FormFieldsCardProvider;
