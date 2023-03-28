import { Grid, Typography, Chip } from '@mui/material';

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

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {users.map((user) => (
              <Grid key={user.id} item>
                <Chip label={user.name} sx={{ fontStyle: 'italic' }} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default LastUsersAnswers;
