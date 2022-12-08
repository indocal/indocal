import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: SectionFormFieldConfigContextState = {
  isEditSectionFormFieldItemDialogOpen: false,
};

interface SectionFormFieldConfigContextState {
  isEditSectionFormFieldItemDialogOpen: boolean;
}

type SectionFormFieldConfigContextStateAction = {
  type: 'EDIT_SECTION_FORM_FIELD_ITEM_DIALOG';
};

function reducer(
  state: SectionFormFieldConfigContextState,
  action: SectionFormFieldConfigContextStateAction
): SectionFormFieldConfigContextState {
  switch (action.type) {
    case 'EDIT_SECTION_FORM_FIELD_ITEM_DIALOG':
      return {
        ...state,
        isEditSectionFormFieldItemDialogOpen:
          !state.isEditSectionFormFieldItemDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: SectionFormFieldConfigContextValue = {
  isEditSectionFormFieldItemDialogOpen:
    initialContextState.isEditSectionFormFieldItemDialogOpen,
  toggleEditSectionFormFieldItemDialog: () => undefined,
};

export interface SectionFormFieldConfigContextValue {
  isEditSectionFormFieldItemDialogOpen: boolean;
  toggleEditSectionFormFieldItemDialog: () => void;
}

const SectionFormFieldConfigContext =
  createContext<SectionFormFieldConfigContextValue>(initialContextValue);

export const SectionFormFieldConfigProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditSectionFormFieldItemDialog = useCallback(
    () => dispatch({ type: 'EDIT_SECTION_FORM_FIELD_ITEM_DIALOG' }),
    []
  );

  return (
    <SectionFormFieldConfigContext.Provider
      value={{
        isEditSectionFormFieldItemDialogOpen:
          state.isEditSectionFormFieldItemDialogOpen,
        toggleEditSectionFormFieldItemDialog:
          handleToggleEditSectionFormFieldItemDialog,
      }}
    >
      {children}
    </SectionFormFieldConfigContext.Provider>
  );
};

export function useSectionFormFieldConfig(): SectionFormFieldConfigContextValue {
  return useContext(SectionFormFieldConfigContext);
}

export default SectionFormFieldConfigProvider;
