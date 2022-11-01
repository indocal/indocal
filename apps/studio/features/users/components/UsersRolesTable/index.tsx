import NextLink from 'next/link';
import {
  Paper,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  IconButton,
  Link as MuiLink,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useUsersRoles } from '@indocal/services';

import { Pages } from '@/config';

export const UsersRolesTable: React.FC = () => {
  const { loading, validating, roles, error } = useUsersRoles({
    orderBy: { name: 'asc' },
  });

  return (
    <Paper sx={{ display: 'grid' }}>
      {loading ? (
        <Loader invisible message="Cargando roles..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : (
        <Stack sx={{ position: 'relative' }}>
          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              gap: (theme) => theme.spacing(1),
              padding: (theme) => theme.spacing(2),
              borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Roles
            </Typography>

            <Button
              size="small"
              variant="contained"
              color="secondary"
              disabled={validating}
              endIcon={<AddIcon />}
            >
              Nuevo rol
            </Button>
          </Stack>

          <Stack sx={{ height: '100%' }}>
            {roles.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rol</TableCell>
                      <TableCell>Descripción</TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          borderLeft: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        --
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            borderLeft: (theme) =>
                              `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={0.25}
                          >
                            <NextLink
                              passHref
                              href={`${Pages.USERS_ROLES}/${role.id}`}
                            >
                              <IconButton LinkComponent={MuiLink} size="small">
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </NextLink>

                            <IconButton LinkComponent={MuiLink} size="small">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <NoData message="Sin roles a mostrar" />
            )}
          </Stack>
        </Stack>
      )}
    </Paper>
  );
};

export default UsersRolesTable;
