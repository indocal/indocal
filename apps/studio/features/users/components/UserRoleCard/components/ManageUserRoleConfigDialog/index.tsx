import { useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
} from '@mui/material';
import {
  Dashboard as StudioAppIcon,
  SupportAgent as NobuAppIcon,
  Event as EventsAppIcon,
  CardMembership as TrainingsAppIcon,
  Warehouse as WarehouseAppIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { UserRole, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useUserRoleCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    access: zod.unknown({
      description: 'Accesos del rol',
      required_error: 'Debe ingresar los accesos del rol',
      invalid_type_error: 'Formato no válido',
    }),
  },
  {
    description: 'Accesos del rol',
    required_error: 'Debe ingresar los accesos del rol',
    invalid_type_error: 'Formato no válido',
  }
);

export interface ManageUserRoleConfigDialogProps {
  role: UserRole;
}

export const ManageUserRoleConfigDialog: React.FC<
  ManageUserRoleConfigDialogProps
> = ({ role }) => {
  const { mutate } = useSWRConfig();

  const { isManageUserRoleConfigDialogOpen, toggleManageUserRoleConfigDialog } =
    useUserRoleCard();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      access: role.config?.access,
    },
  });

  const apps = useMemo(
    () => [
      {
        name: 'studio',
        label: 'Studio',
        icon: <StudioAppIcon />,
      },
      {
        name: 'nobu',
        label: 'Nobu',
        icon: <NobuAppIcon />,
      },
      {
        name: 'events',
        label: 'Eventos',
        icon: <EventsAppIcon />,
      },
      {
        name: 'trainings',
        label: 'Capacitaciones',
        icon: <TrainingsAppIcon />,
      },
      {
        name: 'warehouse',
        label: 'Almacén / Suministro',
        icon: <WarehouseAppIcon />,
      },
    ],
    []
  );

  const onSubmit = useCallback(async () => {
    const { role: updated, error } = await indocal.auth.roles.update(
      role.id,
      {}
    );

    if (error) {
      enqueueSnackbar(
        error.details
          ? error.details.reduce(
              (acc, current) => (acc ? `${acc} | ${current}` : current),
              ``
            )
          : error.message,
        { variant: 'error' }
      );
    } else {
      await mutate(`${ApiEndpoints.USERS_ROLES}/${role.id}`, updated);

      enqueueSnackbar('Accesos actualizados exitosamente', {
        variant: 'success',
        onEntered: toggleManageUserRoleConfigDialog,
      });
    }
  }, [role.id, mutate, toggleManageUserRoleConfigDialog, enqueueSnackbar]);

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleManageUserRoleConfigDialog();
    } else {
      const response = window.confirm(
        '¿Estás seguro que deseas cancelar esta acción?'
      );

      if (response) {
        toggleManageUserRoleConfigDialog();
        reset();
      }
    }
  }, [isDirty, reset, toggleManageUserRoleConfigDialog]);

  return (
    <Dialog
      fullWidth
      open={isManageUserRoleConfigDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Accesos del rol</DialogTitle>

      <DialogContent dividers>
        <List disablePadding sx={{ bgcolor: 'background.paper' }}>
          <ListSubheader>Aplicaciones</ListSubheader>

          {apps.map((app) => (
            <ListItem key={app.name}>
              <ListItemIcon>{app.icon}</ListItemIcon>

              <ListItemText>{app.label}</ListItemText>

              <Switch edge="end" />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
          disabled={!isDirty}
          onClick={handleSubmit(onSubmit)}
        >
          Actualizar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ManageUserRoleConfigDialog;
