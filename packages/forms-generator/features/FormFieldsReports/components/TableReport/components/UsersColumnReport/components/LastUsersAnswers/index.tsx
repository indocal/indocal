import { Unstable_Grid2, Typography, Chip } from '@mui/material';

import { Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useUsers, UUID } from '@indocal/services';

export interface LastUsersAnswers {
  users: UUID[];
}

export const LastUsersAnswers: React.FC<LastUsersAnswers> = ({
  users: uuids,
}) => {
  const { loading, users, error } = useUsers({
    filters: { id: { in: uuids } },
  });

  return (
    <>
      {loading ? (
        <Loader invisible message="Cargando datos..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : users.length > 0 ? (
        <>
          <Typography variant="h6" align="center">
            Ultimas respuestas
          </Typography>

          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {users.map((user) => (
              <Unstable_Grid2 key={user.id}>
                <Chip label={user.name} sx={{ fontStyle: 'italic' }} />
              </Unstable_Grid2>
            ))}
          </Unstable_Grid2>
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default LastUsersAnswers;
