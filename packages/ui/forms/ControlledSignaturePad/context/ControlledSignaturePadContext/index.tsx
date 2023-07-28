import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: ControlledSignaturePadContextState = {
  isSignaturePadDialogOpen: false,
};

interface ControlledSignaturePadContextState {
  isSignaturePadDialogOpen: boolean;
}

type ControlledSignaturePadContextStateAction = {
  type: 'TOGGLE_SIGNATURE_PAD_DIALOG';
};

function reducer(
  state: ControlledSignaturePadContextState,
  action: ControlledSignaturePadContextStateAction
): ControlledSignaturePadContextState {
  switch (action.type) {
    case 'TOGGLE_SIGNATURE_PAD_DIALOG':
      return {
        ...state,
        isSignaturePadDialogOpen: !state.isSignaturePadDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: ControlledSignaturePadContextValue = {
  isSignaturePadDialogOpen: initialContextState.isSignaturePadDialogOpen,
  toggleSignaturePadDialog: () => undefined,
};

export interface ControlledSignaturePadContextValue {
  isSignaturePadDialogOpen: boolean;
  toggleSignaturePadDialog: () => void;
}

const ControlledSignaturePadContext =
  createContext<ControlledSignaturePadContextValue>(initialContextValue);

export const ControlledSignaturePadProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleSignaturePadDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_SIGNATURE_PAD_DIALOG' }),
    []
  );

  return (
    <ControlledSignaturePadContext.Provider
      value={{
        isSignaturePadDialogOpen: state.isSignaturePadDialogOpen,
        toggleSignaturePadDialog: handleToggleSignaturePadDialog,
      }}
    >
      {children}
    </ControlledSignaturePadContext.Provider>
  );
};

export function useControlledSignaturePad(): ControlledSignaturePadContextValue {
  return useContext(ControlledSignaturePadContext);
}

export default ControlledSignaturePadProvider;
