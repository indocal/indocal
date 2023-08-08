import { useReducer, useCallback, useContext, createContext } from 'react';
import { FormProvider, useForm, FieldValues } from 'react-hook-form';

import { ServiceCertificateData } from '@indocal/services';

type Placeholder = {
  type: 'TEXT' | 'SIGNATURE';
  name: string;
};

///////////
// State //
///////////

const initialContextState: GenerateCertificateDialogContextState = {
  autocompletePopoverPlaceholder: null,
  autocompletePopoverAnchorElement: null,
  isAutocompletePopoverOpen: false,
};

interface GenerateCertificateDialogContextState {
  autocompletePopoverPlaceholder: Placeholder | null;
  autocompletePopoverAnchorElement: HTMLElement | null;
  isAutocompletePopoverOpen: boolean;
}

type GenerateCertificateDialogContextStateAction =
  | {
      type: 'OPEN_AUTOCOMPLETE_POPOVER';
      payload: {
        element: HTMLElement;
        placeholder: Placeholder;
      };
    }
  | { type: 'CLOSE_AUTOCOMPLETE_POPOVER' };

function reducer(
  state: GenerateCertificateDialogContextState,
  action: GenerateCertificateDialogContextStateAction
): GenerateCertificateDialogContextState {
  switch (action.type) {
    case 'OPEN_AUTOCOMPLETE_POPOVER':
      return {
        ...state,
        autocompletePopoverPlaceholder: action.payload.placeholder,
        autocompletePopoverAnchorElement: action.payload.element,
        isAutocompletePopoverOpen: true,
      };

    case 'CLOSE_AUTOCOMPLETE_POPOVER':
      return {
        ...state,
        autocompletePopoverPlaceholder: null,
        autocompletePopoverAnchorElement: null,
        isAutocompletePopoverOpen: false,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: GenerateCertificateDialogContextValue = {
  autocompletePopoverPlaceholder:
    initialContextState.autocompletePopoverPlaceholder,

  autocompletePopoverAnchorElement:
    initialContextState.autocompletePopoverAnchorElement,

  isAutocompletePopoverOpen: initialContextState.isAutocompletePopoverOpen,
  openAutocompletePopover: () => undefined,
  closeAutocompletePopover: () => undefined,
};

export interface GenerateCertificateDialogContextValue {
  autocompletePopoverPlaceholder: Placeholder | null;
  autocompletePopoverAnchorElement: HTMLElement | null;

  isAutocompletePopoverOpen: boolean;

  openAutocompletePopover: (
    anchor: HTMLElement,
    placeholder: Placeholder
  ) => void;

  closeAutocompletePopover: () => void;
}

const GenerateCertificateDialogContext =
  createContext<GenerateCertificateDialogContextValue>(initialContextValue);

export interface GenerateCertificateDialogProviderProps {
  defaultValues?: ServiceCertificateData;
}

export const GenerateCertificateDialogProvider: React.FC<
  React.PropsWithChildren<GenerateCertificateDialogProviderProps>
> = ({ defaultValues, children }) => {
  const methods = useForm({ defaultValues: defaultValues as FieldValues });

  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleOpenAutocompletePopover = useCallback(
    (anchor: HTMLElement, placeholder: Placeholder) =>
      dispatch({
        type: 'OPEN_AUTOCOMPLETE_POPOVER',
        payload: { element: anchor, placeholder },
      }),
    []
  );

  const handleCloseAutocompletePopover = useCallback(
    () => dispatch({ type: 'CLOSE_AUTOCOMPLETE_POPOVER' }),
    []
  );

  return (
    <GenerateCertificateDialogContext.Provider
      value={{
        autocompletePopoverPlaceholder: state.autocompletePopoverPlaceholder,

        autocompletePopoverAnchorElement:
          state.autocompletePopoverAnchorElement,

        isAutocompletePopoverOpen: state.isAutocompletePopoverOpen,
        openAutocompletePopover: handleOpenAutocompletePopover,
        closeAutocompletePopover: handleCloseAutocompletePopover,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </GenerateCertificateDialogContext.Provider>
  );
};

export function useGenerateCertificateDialog(): GenerateCertificateDialogContextValue {
  return useContext(GenerateCertificateDialogContext);
}

export default GenerateCertificateDialogProvider;
