import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: TableFormFieldConfigContextState = {
  isEditTableFormFieldColumnDialogOpen: false,
};

interface TableFormFieldConfigContextState {
  isEditTableFormFieldColumnDialogOpen: boolean;
}

type TableFormFieldConfigContextStateAction = {
  type: 'EDIT_TABLE_FORM_FIELD_COLUMN_DIALOG';
};

function reducer(
  state: TableFormFieldConfigContextState,
  action: TableFormFieldConfigContextStateAction
): TableFormFieldConfigContextState {
  switch (action.type) {
    case 'EDIT_TABLE_FORM_FIELD_COLUMN_DIALOG':
      return {
        ...state,
        isEditTableFormFieldColumnDialogOpen:
          !state.isEditTableFormFieldColumnDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: TableFormFieldConfigContextValue = {
  isEditTableFormFieldColumnDialogOpen:
    initialContextState.isEditTableFormFieldColumnDialogOpen,
  toggleEditTableFormFieldColumnDialog: () => undefined,
};

export interface TableFormFieldConfigContextValue {
  isEditTableFormFieldColumnDialogOpen: boolean;
  toggleEditTableFormFieldColumnDialog: () => void;
}

const TableFormFieldConfigContext =
  createContext<TableFormFieldConfigContextValue>(initialContextValue);

export const TableFormFieldConfigProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleEditTableFormFieldColumnDialog = useCallback(
    () => dispatch({ type: 'EDIT_TABLE_FORM_FIELD_COLUMN_DIALOG' }),
    []
  );

  return (
    <TableFormFieldConfigContext.Provider
      value={{
        isEditTableFormFieldColumnDialogOpen:
          state.isEditTableFormFieldColumnDialogOpen,
        toggleEditTableFormFieldColumnDialog:
          handleToggleEditTableFormFieldColumnDialog,
      }}
    >
      {children}
    </TableFormFieldConfigContext.Provider>
  );
};

export function useTableFormFieldConfig(): TableFormFieldConfigContextValue {
  return useContext(TableFormFieldConfigContext);
}

export default TableFormFieldConfigProvider;
