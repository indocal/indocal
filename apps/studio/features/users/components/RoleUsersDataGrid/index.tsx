import { useCallback } from 'react';

import { useAbility, useUsers, UserRole } from '@indocal/services';

import { GenericUsersDataGrid } from '@/features';

import { RoleUsersDataGridProvider, useRoleUsersDataGrid } from './context';
import { ManageRoleUsersDialog } from './components';

export interface RoleUsersDataGridProps {
  role: UserRole;
}

const RoleUsersDataGrid: React.FC<RoleUsersDataGridProps> = ({ role }) => {
  const ability = useAbility();

  const {
    loading,
    validating,
    users,
    error: serviceError,
    refetch,
  } = useUsers({
    filters: { roles: { some: { id: role.id } } },
    orderBy: { username: 'asc' },
  });

  const { isManageRoleUsersDialogOpen, toggleManageRoleUsersDialog } =
    useRoleUsersDataGrid();

  const handleAdd = useCallback(
    () => toggleManageRoleUsersDialog(),
    [toggleManageRoleUsersDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isManageRoleUsersDialogOpen && <ManageRoleUsersDialog role={role} />}

      <GenericUsersDataGrid
        title={`Miembros del rol (${users.length})`}
        users={users}
        onAddButtonClick={
          ability.can('update', 'userRole') &&
          ability.can('read', 'user') &&
          handleAdd
        }
        onRefreshButtonClick={ability.can('read', 'user') && handleRefetch}
        enhancedDataGridProps={{
          density: 'compact',
          loading: loading || validating,
          error: serviceError,
          quickFilterProps: { placeholder: 'Buscar...' },
        }}
      />
    </>
  );
};

const RoleUsersDataGridWrapper: React.FC<RoleUsersDataGridProps> = (props) => (
  <RoleUsersDataGridProvider>
    <RoleUsersDataGrid {...props} />
  </RoleUsersDataGridProvider>
);

export { RoleUsersDataGridWrapper as RoleUsersDataGrid };

export default RoleUsersDataGridWrapper;
