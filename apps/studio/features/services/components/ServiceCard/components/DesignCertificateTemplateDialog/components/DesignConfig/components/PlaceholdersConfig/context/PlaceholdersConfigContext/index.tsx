import { useReducer, useCallback, useContext, createContext } from 'react';

import { Service } from '@indocal/services';

///////////
// State //
///////////

const initialContextState: PlaceholdersConfigContextState = {
  isAddPlaceholderDialogOpen: false,
  isAddSignaturePlaceholderDialogOpen: false,
  isEditPlaceholderDialogOpen: false,
};

interface PlaceholdersConfigContextState {
  isAddPlaceholderDialogOpen: boolean;
  isAddSignaturePlaceholderDialogOpen: boolean;
  isEditPlaceholderDialogOpen: boolean;
}

type PlaceholdersConfigContextStateAction =
  | { type: 'TOGGLE_ADD_PLACEHOLDER_DIALOG' }
  | { type: 'TOGGLE_ADD_SIGNATURE_PLACEHOLDER_DIALOG' }
  | { type: 'TOGGLE_EDIT_PLACEHOLDER_DIALOG' };

function reducer(
  state: PlaceholdersConfigContextState,
  action: PlaceholdersConfigContextStateAction
): PlaceholdersConfigContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_PLACEHOLDER_DIALOG':
      return {
        ...state,
        isAddPlaceholderDialogOpen: !state.isAddPlaceholderDialogOpen,
      };

    case 'TOGGLE_ADD_SIGNATURE_PLACEHOLDER_DIALOG':
      return {
        ...state,
        isAddSignaturePlaceholderDialogOpen:
          !state.isAddSignaturePlaceholderDialogOpen,
      };

    case 'TOGGLE_EDIT_PLACEHOLDER_DIALOG':
      return {
        ...state,
        isEditPlaceholderDialogOpen: !state.isEditPlaceholderDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: PlaceholdersConfigContextValue = {
  service: {} as Service,
  isAddPlaceholderDialogOpen: initialContextState.isAddPlaceholderDialogOpen,
  toggleAddPlaceholderDialog: () => undefined,
  isAddSignaturePlaceholderDialogOpen:
    initialContextState.isAddSignaturePlaceholderDialogOpen,
  toggleAddSignaturePlaceholderDialog: () => undefined,
  isEditPlaceholderDialogOpen: initialContextState.isEditPlaceholderDialogOpen,
  toggleEditPlaceholderDialog: () => undefined,
};

export interface PlaceholdersConfigContextValue {
  service: Service;
  isAddPlaceholderDialogOpen: boolean;
  toggleAddPlaceholderDialog: () => void;
  isAddSignaturePlaceholderDialogOpen: boolean;
  toggleAddSignaturePlaceholderDialog: () => void;
  isEditPlaceholderDialogOpen: boolean;
  toggleEditPlaceholderDialog: () => void;
}

const PlaceholdersConfigContext =
  createContext<PlaceholdersConfigContextValue>(initialContextValue);

export interface PlaceholdersConfigProviderProps {
  service: Service;
}

export const PlaceholdersConfigProvider: React.FC<
  React.PropsWithChildren<PlaceholdersConfigProviderProps>
> = ({ service, children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddPlaceholderDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_PLACEHOLDER_DIALOG' }),
    []
  );

  const handleToggleAddSignaturePlaceholderDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_SIGNATURE_PLACEHOLDER_DIALOG' }),
    []
  );

  const handleToggleEditPlaceholderDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_PLACEHOLDER_DIALOG' }),
    []
  );

  return (
    <PlaceholdersConfigContext.Provider
      value={{
        service,
        isAddPlaceholderDialogOpen: state.isAddPlaceholderDialogOpen,
        toggleAddPlaceholderDialog: handleToggleAddPlaceholderDialog,
        isAddSignaturePlaceholderDialogOpen:
          state.isAddSignaturePlaceholderDialogOpen,
        toggleAddSignaturePlaceholderDialog:
          handleToggleAddSignaturePlaceholderDialog,
        isEditPlaceholderDialogOpen: state.isEditPlaceholderDialogOpen,
        toggleEditPlaceholderDialog: handleToggleEditPlaceholderDialog,
      }}
    >
      {children}
    </PlaceholdersConfigContext.Provider>
  );
};

export function usePlaceholdersConfig(): PlaceholdersConfigContextValue {
  return useContext(PlaceholdersConfigContext);
}

export default PlaceholdersConfigProvider;
