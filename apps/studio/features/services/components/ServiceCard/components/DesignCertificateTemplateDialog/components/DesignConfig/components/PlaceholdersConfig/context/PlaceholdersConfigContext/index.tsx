import { useReducer, useCallback, useContext, createContext } from 'react';

import { Service } from '@indocal/services';

///////////
// State //
///////////

const initialContextState: PlaceholdersConfigContextState = {
  isAddPlaceholderDialogOpen: false,
  isEditPlaceholderDialogOpen: false,
};

interface PlaceholdersConfigContextState {
  isAddPlaceholderDialogOpen: boolean;
  isEditPlaceholderDialogOpen: boolean;
}

type PlaceholdersConfigContextStateAction =
  | { type: 'TOGGLE_ADD_PLACEHOLDER_DIALOG' }
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
  isEditPlaceholderDialogOpen: initialContextState.isEditPlaceholderDialogOpen,
  toggleEditPlaceholderDialog: () => undefined,
};

export interface PlaceholdersConfigContextValue {
  service: Service;
  isAddPlaceholderDialogOpen: boolean;
  toggleAddPlaceholderDialog: () => void;
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
