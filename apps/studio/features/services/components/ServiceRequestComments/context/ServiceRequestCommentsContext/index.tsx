import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: ServiceRequestCommentsContextState = {
  isAddCommentDialogOpen: false,
  isEditCommentDialogOpen: false,
};

interface ServiceRequestCommentsContextState {
  isAddCommentDialogOpen: boolean;
  isEditCommentDialogOpen: boolean;
}

type ServiceRequestCommentsContextStateAction =
  | { type: 'TOGGLE_ADD_COMMENT_DIALOG' }
  | { type: 'TOGGLE_EDIT_COMMENT_DIALOG' };

function reducer(
  state: ServiceRequestCommentsContextState,
  action: ServiceRequestCommentsContextStateAction
): ServiceRequestCommentsContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_COMMENT_DIALOG':
      return {
        ...state,
        isAddCommentDialogOpen: !state.isAddCommentDialogOpen,
      };

    case 'TOGGLE_EDIT_COMMENT_DIALOG':
      return {
        ...state,
        isEditCommentDialogOpen: !state.isEditCommentDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: ServiceRequestCommentsContextValue = {
  isAddCommentDialogOpen: initialContextState.isAddCommentDialogOpen,
  toggleAddCommentDialog: () => undefined,

  isEditCommentDialogOpen: initialContextState.isEditCommentDialogOpen,
  toggleEditCommentDialog: () => undefined,
};

export interface ServiceRequestCommentsContextValue {
  isAddCommentDialogOpen: boolean;
  toggleAddCommentDialog: () => void;

  isEditCommentDialogOpen: boolean;
  toggleEditCommentDialog: () => void;
}

const ServiceRequestCommentsContext =
  createContext<ServiceRequestCommentsContextValue>(initialContextValue);

export const ServiceRequestCommentsProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddCommentDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_COMMENT_DIALOG' }),
    []
  );

  const handleToggleEditCommentDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_EDIT_COMMENT_DIALOG' }),
    []
  );

  return (
    <ServiceRequestCommentsContext.Provider
      value={{
        isAddCommentDialogOpen: state.isAddCommentDialogOpen,
        toggleAddCommentDialog: handleToggleAddCommentDialog,

        isEditCommentDialogOpen: state.isEditCommentDialogOpen,
        toggleEditCommentDialog: handleToggleEditCommentDialog,
      }}
    >
      {children}
    </ServiceRequestCommentsContext.Provider>
  );
};

export function useServiceRequestComments(): ServiceRequestCommentsContextValue {
  return useContext(ServiceRequestCommentsContext);
}

export default ServiceRequestCommentsProvider;
