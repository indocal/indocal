import { useReducer, useCallback, useContext, createContext } from 'react';

import { INDOCAL } from '@indocal/services';

///////////
// State //
///////////

const initialContextState: FilesGalleryContextState = {
  isAddFileDialogOpen: false,
  isEditFileDialogOpen: false,
};

interface FilesGalleryContextState {
  isAddFileDialogOpen: boolean;
  isEditFileDialogOpen: boolean;
}

type FilesGalleryContextStateAction =
  | { type: 'TOGGLE_ADD_FILE_DIALOG' }
  | { type: 'TOGGLE_EDIT_FILE_DIALOG' };

function reducer(
  state: FilesGalleryContextState,
  action: FilesGalleryContextStateAction
): FilesGalleryContextState {
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

export const initialContextValue: FilesGalleryContextValue = {
  isAddFileDialogOpen: initialContextState.isAddFileDialogOpen,
  toggleAddFileDialog: () => undefined,
  isEditFileDialogOpen: initialContextState.isEditFileDialogOpen,
  toggleEditFileDialog: () => undefined,
  client: {} as INDOCAL,
};

export interface FilesGalleryContextValue {
  isAddFileDialogOpen: boolean;
  toggleAddFileDialog: () => void;
  isEditFileDialogOpen: boolean;
  toggleEditFileDialog: () => void;
  client: INDOCAL;
}

const FilesGalleryContext =
  createContext<FilesGalleryContextValue>(initialContextValue);

export interface FilesGalleryProviderProps {
  client: INDOCAL;
}

export const FilesGalleryProvider: React.FC<
  React.PropsWithChildren<FilesGalleryProviderProps>
> = ({ client, children }) => {
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
    <FilesGalleryContext.Provider
      value={{
        client,
        isAddFileDialogOpen: state.isAddFileDialogOpen,
        toggleAddFileDialog: handleToggleAddFileDialog,
        isEditFileDialogOpen: state.isEditFileDialogOpen,
        toggleEditFileDialog: handleToggleEditFileDialog,
      }}
    >
      {children}
    </FilesGalleryContext.Provider>
  );
};

export function useFilesGallery(): FilesGalleryContextValue {
  return useContext(FilesGalleryContext);
}

export default FilesGalleryProvider;
