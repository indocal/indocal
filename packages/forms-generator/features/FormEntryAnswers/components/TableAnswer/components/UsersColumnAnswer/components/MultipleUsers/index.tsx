import { Stack, Chip } from '@mui/material';

import { Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useUsers, UUID } from '@indocal/services';

export interface MultipleUsersProps {
  users: UUID[];
}

export const MultipleUsers: React.FC<MultipleUsersProps> = ({
  users: uuids,
}) => {
  const { loading, users, error } = useUsers({
    filters: { id: { in: uuids } },
  });

  return loading ? (
    <Loader invisible message="Cargando datos..." />
  ) : error ? (
    <ErrorInfo error={error} />
  ) : users.length > 0 ? (
    <Stack direction="row" spacing={1}>
      {users.map((user) => (
        <Chip key={user.id} label={user.email} sx={{ width: 'fit-content' }} />
      ))}
    </Stack>
  ) : (
    <NotFound />
  );
};

export default MultipleUsers;
