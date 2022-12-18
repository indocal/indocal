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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Block as NoneAccessIcon,
  Person as StandardAccessIcon,
  AdminPanelSettings as AdminAccessIcon,
  Dashboard as StudioAppIcon,
  SupportAgent as NobuAppIcon,
  Event as EventsAppIcon,
  CardMembership as TrainingsAppIcon,
  Warehouse as WarehouseAppIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useSWRConfig } from 'swr';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import {
  Can,
  UserRole,
  UserRoleAccessType,
  ApiEndpoints,
} from '@indocal/services';

import { indocal } from '@/lib';

import { useUserRoleCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    access: zod.record(
      zod.enum<string, [UserRoleAccessType, ...UserRoleAccessType[]]>([
        'NONE',
        'STANDARD',
        'ADMIN',
      ]),
      {
        description: 'Accesos del rol',
        required_error: 'Debe seleccionar los accesos del rol',
        invalid_type_error: 'Formato no válido',
      }
    ),
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
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      access: {
        studio: role.config?.access?.studio || 'NONE',
        nobu: role.config?.access?.nobu || 'NONE',
        events: role.config?.access?.events || 'NONE',
        trainings: role.config?.access?.trainings || 'NONE',
        warehouse: role.config?.access?.warehouse || 'NONE',
      },
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

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { role: updated, error } = await indocal.auth.roles.update(
        role.id,
        {
          config: {
            ...role.config,
            access: formData.access,
          },
        }
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
    },
    [
      role.id,
      role.config,
      mutate,
      toggleManageUserRoleConfigDialog,
      enqueueSnackbar,
    ]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleManageUserRoleConfigDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleManageUserRoleConfigDialog();
      reset();
    }
  }, [isDirty, reset, toggleManageUserRoleConfigDialog]);

  return (
    <Dialog
      fullWidth
      open={isManageUserRoleConfigDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Configuración del rol</DialogTitle>

      <DialogContent dividers>
        <Can I="update" an="userRole" passThrough>
          {(allowed) => (
            <List disablePadding sx={{ bgcolor: 'background.paper' }}>
              <ListSubheader disableSticky>Accesos</ListSubheader>

              {apps.map((app) => (
                <ListItem key={app.name} divider>
                  <ListItemIcon>{app.icon}</ListItemIcon>

                  <ListItemText sx={{ display: ['none', 'inherit'] }}>
                    {app.label}
                  </ListItemText>

                  <Controller
                    name={`access.${app.name}`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={value}
                        disabled={!allowed}
                        onChange={(_, value) => onChange(value)}
                        sx={{ marginLeft: 'auto' }}
                      >
                        <ToggleButton value={'NONE' as UserRoleAccessType}>
                          <NoneAccessIcon />
                        </ToggleButton>

                        <ToggleButton value={'STANDARD' as UserRoleAccessType}>
                          <StandardAccessIcon />
                        </ToggleButton>

                        <ToggleButton value={'ADMIN' as UserRoleAccessType}>
                          <AdminAccessIcon />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Can>
      </DialogContent>

      <Can I="update" an="userRole">
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
      </Can>
    </Dialog>
  );
};

export default ManageUserRoleConfigDialog;
