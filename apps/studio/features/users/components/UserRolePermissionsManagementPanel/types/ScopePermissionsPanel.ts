type ScopePermission = {
  label: string;
  action: string;
  checked: boolean;
};

type ScopePermissionsSubPanel = {
  scope: string;
  permissions: ScopePermission[];
};

export interface ScopePermissionsPanel {
  label: string;
  subPanels: ScopePermissionsSubPanel[];
}

export default ScopePermissionsPanel;
