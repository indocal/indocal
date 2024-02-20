import { useReducer, useCallback, useContext, createContext } from 'react';

///////////
// State //
///////////

const initialContextState: CertificatesDataGridContextState = {
  isAddCertificateDialogOpen: false,
  isGenerateCertificateDialogOpen: false,
};

interface CertificatesDataGridContextState {
  isAddCertificateDialogOpen: boolean;
  isGenerateCertificateDialogOpen: boolean;
}

type CertificatesDataGridContextStateAction =
  {
    type: 'TOGGLE_ADD_CERTIFICATE_DIALOG';
  } |
  {
    type: 'TOGGLE_GENERATE_CERTIFICATE_DIALOG';
  };

function reducer(
  state: CertificatesDataGridContextState,
  action: CertificatesDataGridContextStateAction
): CertificatesDataGridContextState {
  switch (action.type) {
    case 'TOGGLE_ADD_CERTIFICATE_DIALOG':
      return {
        ...state,
        isAddCertificateDialogOpen: !state.isAddCertificateDialogOpen,
      };

    case 'TOGGLE_GENERATE_CERTIFICATE_DIALOG':
      return {
        ...state,
        isGenerateCertificateDialogOpen: !state.isGenerateCertificateDialogOpen,
      };

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: CertificatesDataGridContextValue = {
  isAddCertificateDialogOpen: initialContextState.isAddCertificateDialogOpen,
  toggleAddCertificateDialog: () => undefined,

  isGenerateCertificateDialogOpen: initialContextState.isGenerateCertificateDialogOpen,
  toggleGenerateCertificateDialog: () => undefined,
};

export interface CertificatesDataGridContextValue {
  isAddCertificateDialogOpen: boolean;
  toggleAddCertificateDialog: () => void;

  isGenerateCertificateDialogOpen: boolean;
  toggleGenerateCertificateDialog: () => void;
}

const CertificatesDataGridContext =
  createContext<CertificatesDataGridContextValue>(initialContextValue);

export const CertificatesDataGridProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleAddCertificateDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_ADD_CERTIFICATE_DIALOG' }),
    []
  );

  const handleToggleGenerateCertificateDialog = useCallback(
    () => dispatch({ type: 'TOGGLE_GENERATE_CERTIFICATE_DIALOG' }),
    []
  );

  return (
    <CertificatesDataGridContext.Provider
      value={{
        isAddCertificateDialogOpen: state.isAddCertificateDialogOpen,
        toggleAddCertificateDialog: handleToggleAddCertificateDialog,

        isGenerateCertificateDialogOpen: state.isGenerateCertificateDialogOpen,
        toggleGenerateCertificateDialog: handleToggleGenerateCertificateDialog,
      }}
    >
      {children}
    </CertificatesDataGridContext.Provider>
  );
};

export function useCertificatesDataGrid(): CertificatesDataGridContextValue {
  return useContext(CertificatesDataGridContext);
}

export default CertificatesDataGridProvider;
