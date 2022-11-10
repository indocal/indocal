import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: FormFieldsCardContextState = {
  isManageFormFieldsDialogOpen: false,
  isAddFormFieldDialogOpen: false,
  isEditFormFieldDialogOpen: false,
};

interface FormFieldsCardContextState {
  isManageFormFieldsDialogOpen: boolean;
  isAddFormFieldDialogOpen: boolean;
  isEditFormFieldDialogOpen: boolean;
}

type FormFieldsCardContextStateAction =
  | { type: 'TOGGLE_MANAGE_FORM_FIELDS_DIALOG' }
  | { type: 'TOGGLE_ADD_FORM_FIELD_DIALOG' }
  | { type: 'TOGGLE_EDIT_FORM_FIELD_DIALOG' };

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

    case 'TOGGLE_ADD_FORM_FIELD_DIALOG':
      return {
        ...state,
        isAddFormFieldDialogOpen: !state.isAddFormFieldDialogOpen,
      };

    case 'TOGGLE_EDIT_FORM_FIELD_DIALOG':
      return {
        ...state,
        isEditFormFieldDialogOpen: !state.isEditFormFieldDialogOpen,
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

  isAddFormFieldDialogOpen: initialContextState.isAddFormFieldDialogOpen,
  toggleAddFormFieldDialog: () => undefined,

  isEditFormFieldDialogOpen: initialContextState.isEditFormFieldDialogOpen,
  toggleEditFormFieldDialog: () => undefined,
};

export interface FormFieldsCardContextValue {
  isManageFormFieldsDialogOpen: boolean;
  toggleManageFormFieldsDialog: () => void;
  isAddFormFieldDialogOpen: boolean;
  toggleAddFormFieldDialog: () => void;
  isEditFormFieldDialogOpen: boolean;
  toggleEditFormFieldDialog: () => void;
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

  const handleToggleAddFormFieldDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_FORM_FIELD_DIALOG' }),
    []
  );

  const handleToggleEditFormFieldDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_FORM_FIELD_DIALOG' }),
    []
  );

  return (
    <FormFieldsCardContext.Provider
      value={{
        isManageFormFieldsDialogOpen: state.isManageFormFieldsDialogOpen,
        toggleManageFormFieldsDialog: handleToggleManageFormFieldsDialog,
        isAddFormFieldDialogOpen: state.isAddFormFieldDialogOpen,
        toggleAddFormFieldDialog: handleToggleAddFormFieldDialog,
        isEditFormFieldDialogOpen: state.isEditFormFieldDialogOpen,
        toggleEditFormFieldDialog: handleToggleEditFormFieldDialog,
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
