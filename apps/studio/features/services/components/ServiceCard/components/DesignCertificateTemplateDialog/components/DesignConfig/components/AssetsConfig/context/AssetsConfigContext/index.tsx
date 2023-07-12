import { useReducer, useCallback, useContext, createContext } from 'react';

import { Service } from '@indocal/services';

///////////
// State //
///////////

const initialContextState: AssetsConfigContextState = {
  isAddFileDialogOpen: false,
  isEditFileDialogOpen: false,
};

interface AssetsConfigContextState {
  isAddFileDialogOpen: boolean;
  isEditFileDialogOpen: boolean;
}

type AssetsConfigContextStateAction =
  | { type: 'TOGGLE_ADD_FILE_DIALOG' }
  | { type: 'TOGGLE_EDIT_FILE_DIALOG' };

function reducer(
  state: AssetsConfigContextState,
  action: AssetsConfigContextStateAction
): AssetsConfigContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_FILE_DIALOG':
      return {
        ...state,
        isAddFileDialogOpen: !state.isAddFileDialogOpen,
      };

    case 'TOGGLE_EDIT_FILE_DIALOG':
      return {
        ...state,
        isEditFileDialogOpen: !state.isEditFileDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: AssetsConfigContextValue = {
  service: {} as Service,
  isAddFileDialogOpen: initialContextState.isAddFileDialogOpen,
  toggleAddFileDialog: () => undefined,
  isEditFileDialogOpen: initialContextState.isEditFileDialogOpen,
  toggleEditFileDialog: () => undefined,
};

export interface AssetsConfigContextValue {
  service: Service;
  isAddFileDialogOpen: boolean;
  toggleAddFileDialog: () => void;
  isEditFileDialogOpen: boolean;
  toggleEditFileDialog: () => void;
}

const AssetsConfigContext =
  createContext<AssetsConfigContextValue>(initialContextValue);

export interface AssetsConfigProviderProps {
  service: Service;
}

export const AssetsConfigProvider: React.FC<
  React.PropsWithChildren<AssetsConfigProviderProps>
> = ({ service, children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddFileDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_FILE_DIALOG' }),
    []
  );

  const handleToggleEditFileDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_FILE_DIALOG' }),
    []
  );

  return (
    <AssetsConfigContext.Provider
      value={{
        service,
        isAddFileDialogOpen: state.isAddFileDialogOpen,
        toggleAddFileDialog: handleToggleAddFileDialog,
        isEditFileDialogOpen: state.isEditFileDialogOpen,
        toggleEditFileDialog: handleToggleEditFileDialog,
      }}
    >
      {children}
    </AssetsConfigContext.Provider>
  );
};

export function useAssetsConfig(): AssetsConfigContextValue {
  return useContext(AssetsConfigContext);
}

export default AssetsConfigProvider;
