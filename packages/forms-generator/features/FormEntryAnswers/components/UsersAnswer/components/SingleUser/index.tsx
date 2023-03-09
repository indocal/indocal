import { Chip } from '@mui/material';

import { Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useUser, UUID } from '@indocal/services';

export interface SingleUserProps {
  user: UUID;
}

export const SingleUser: React.FC<SingleUserProps> = ({ user: uuid }) => {
  const { loading, user, error } = useUser(uuid);

  return loading ? (
    <Loader invisible message="Cargando datos..." />
  ) : error ? (
    <ErrorInfo error={error} />
  ) : user ? (
    <Chip label={user.email} sx={{ width: 'fit-content' }} />
  ) : (
    <NotFound />
  );
};

export default SingleUser;
