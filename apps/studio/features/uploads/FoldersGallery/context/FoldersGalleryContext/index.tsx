import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: FoldersGalleryContextState = {
  isAddFolderDialogOpen: false,
  isEditFolderDialogOpen: false,
};

interface FoldersGalleryContextState {
  isAddFolderDialogOpen: boolean;
  isEditFolderDialogOpen: boolean;
}

type FoldersGalleryContextStateAction =
  | { type: 'TOGGLE_ADD_FOLDER_DIALOG' }
  | { type: 'TOGGLE_EDIT_FOLDER_DIALOG' };

function reducer(
  state: FoldersGalleryContextState,
  action: FoldersGalleryContextStateAction
): FoldersGalleryContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_FOLDER_DIALOG':
      return {
        ...state,
        isAddFolderDialogOpen: !state.isAddFolderDialogOpen,
      };

    case 'TOGGLE_EDIT_FOLDER_DIALOG':
      return {
        ...state,
        isEditFolderDialogOpen: !state.isEditFolderDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: FoldersGalleryContextValue = {
  isAddFolderDialogOpen: initialContextState.isAddFolderDialogOpen,
  toggleAddFolderDialog: () => undefined,
  isEditFolderDialogOpen: initialContextState.isEditFolderDialogOpen,
  toggleEditFolderDialog: () => undefined,
};

export interface FoldersGalleryContextValue {
  isAddFolderDialogOpen: boolean;
  toggleAddFolderDialog: () => void;
  isEditFolderDialogOpen: boolean;
  toggleEditFolderDialog: () => void;
}

const FoldersGalleryContext =
  createContext<FoldersGalleryContextValue>(initialContextValue);

export const FoldersGalleryProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddFolderDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_FOLDER_DIALOG' }),
    []
  );

  const handleToggleEditFolderDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_FOLDER_DIALOG' }),
    []
  );

  return (
    <FoldersGalleryContext.Provider
      value={{
        isAddFolderDialogOpen: state.isAddFolderDialogOpen,
        toggleAddFolderDialog: handleToggleAddFolderDialog,
        isEditFolderDialogOpen: state.isEditFolderDialogOpen,
        toggleEditFolderDialog: handleToggleEditFolderDialog,
      }}
    >
      {children}
    </FoldersGalleryContext.Provider>
  );
};

export function useFoldersGallery(): FoldersGalleryContextValue {
  return useContext(FoldersGalleryContext);
}

export default FoldersGalleryProvider;
