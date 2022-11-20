import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: GroupFormsDataGridContextState = {
  isAddGroupFormDialogOpen: false,
};

interface GroupFormsDataGridContextState {
  isAddGroupFormDialogOpen: boolean;
}

type GroupFormsDataGridContextStateAction = {
  type: 'TOGGLE_ADD_GROUP_FORM_DIALOG';
};

function reducer(
  state: GroupFormsDataGridContextState,
  action: GroupFormsDataGridContextStateAction
): GroupFormsDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_GROUP_FORM_DIALOG':
      return {
        ...state,
        isAddGroupFormDialogOpen: !state.isAddGroupFormDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: GroupFormsDataGridContextValue = {
  isAddGroupFormDialogOpen: initialContextState.isAddGroupFormDialogOpen,
  toggleAddGroupFormDialog: () => undefined,
};

export interface GroupFormsDataGridContextValue {
  isAddGroupFormDialogOpen: boolean;
  toggleAddGroupFormDialog: () => void;
}

const GroupFormsDataGridContext =
  createContext<GroupFormsDataGridContextValue>(initialContextValue);

export const GroupFormsDataGridProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddGroupFormDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_GROUP_FORM_DIALOG' }),
    []
  );

  return (
    <GroupFormsDataGridContext.Provider
      value={{
        isAddGroupFormDialogOpen: state.isAddGroupFormDialogOpen,
        toggleAddGroupFormDialog: handleToggleAddGroupFormDialog,
      }}
    >
      {children}
    </GroupFormsDataGridContext.Provider>
  );
};

export function useGroupFormsDataGrid(): GroupFormsDataGridContextValue {
  return useContext(GroupFormsDataGridContext);
}

export default GroupFormsDataGridProvider;
