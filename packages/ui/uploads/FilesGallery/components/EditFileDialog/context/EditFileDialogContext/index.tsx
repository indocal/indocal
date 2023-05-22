import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: EditFileDialogContextState = {
  isReplaceFileDialogOpen: false,
};

interface EditFileDialogContextState {
  isReplaceFileDialogOpen: boolean;
}

type EditFileDialogContextStateAction = { type: 'TOGGLE_REPLACE_FILE_DIALOG' };

function reducer(
  state: EditFileDialogContextState,
  action: EditFileDialogContextStateAction
): EditFileDialogContextState {
  switch (action.type) {
    case 'TOGGLE_REPLACE_FILE_DIALOG':
      return {
        ...state,
        isReplaceFileDialogOpen: !state.isReplaceFileDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: EditFileDialogContextValue = {
  isReplaceFileDialogOpen: initialContextState.isReplaceFileDialogOpen,
  toggleReplaceFileDialog: () => undefined,
};

export interface EditFileDialogContextValue {
  isReplaceFileDialogOpen: boolean;
  toggleReplaceFileDialog: () => void;
}

const EditFileDialogContext =
  createContext<EditFileDialogContextValue>(initialContextValue);

export const EditFileDialogProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleReplaceFileDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_REPLACE_FILE_DIALOG' }),
    []
  );

  return (
    <EditFileDialogContext.Provider
      value={{
        isReplaceFileDialogOpen: state.isReplaceFileDialogOpen,
        toggleReplaceFileDialog: handleToggleReplaceFileDialog,
      }}
    >
      {children}
    </EditFileDialogContext.Provider>
  );
};

export function useEditFileDialog(): EditFileDialogContextValue {
  return useContext(EditFileDialogContext);
}

export default EditFileDialogProvider;
