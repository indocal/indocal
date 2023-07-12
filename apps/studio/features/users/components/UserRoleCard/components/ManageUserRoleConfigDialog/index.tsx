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
  Block as ForbiddenAccessIcon,
  AdminPanelSettings as AllowedAccessIcon,
  Dashboard as StudioAppIcon,
  Hub as HubIcon,
  Apps as AppIcon,
  SupportAgent as NobuAppIcon,
  Warehouse as WarehouseAppIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
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
    access: zod.object(
      {
        studio: zod.enum<
          UserRoleAccessType,
          [UserRoleAccessType, ...UserRoleAccessType[]]
        >(['FORBIDDEN', 'ALLOWED']),

        hub: zod.enum<
          UserRoleAccessType,
          [UserRoleAccessType, ...UserRoleAccessType[]]
        >(['FORBIDDEN', 'ALLOWED']),

        app: zod.enum<
          UserRoleAccessType,
          [UserRoleAccessType, ...UserRoleAccessType[]]
        >(['FORBIDDEN', 'ALLOWED']),

        nobu: zod.enum<
          UserRoleAccessType,
          [UserRoleAccessType, ...UserRoleAccessType[]]
        >(['FORBIDDEN', 'ALLOWED']),

        warehouse: zod.enum<
          UserRoleAccessType,
          [UserRoleAccessType, ...UserRoleAccessType[]]
        >(['FORBIDDEN', 'ALLOWED']),
      },
      {
        description: 'Accesos del rol',
        required_error: 'Debe seleccionar los accesos del rol',
        invalid_type_error: 'Formato no válido',
      }
    ),
  },
  {
    description: 'Configuración del rol',
    required_error: 'Debe ingresar la configuración del rol',
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

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      access: {
        studio: role.config?.access?.studio || 'FORBIDDEN',
        hub: role.config?.access?.hub || 'FORBIDDEN',
        app: role.config?.access?.app || 'FORBIDDEN',
        nobu: role.config?.access?.nobu || 'FORBIDDEN',
        warehouse: role.config?.access?.warehouse || 'FORBIDDEN',
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
        name: 'hub',
        label: 'Hub',
        icon: <HubIcon />,
      },
      {
        name: 'app',
        label: 'App',
        icon: <AppIcon />,
      },
      {
        name: 'nobu',
        label: 'Nobu',
        icon: <NobuAppIcon />,
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

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleManageUserRoleConfigDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleManageUserRoleConfigDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleManageUserRoleConfigDialog, confirm]);

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
                    name={`access.${app.name as keyof FormData['access']}`}
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
                        <ToggleButton value={'FORBIDDEN' as UserRoleAccessType}>
                          <ForbiddenAccessIcon />
                        </ToggleButton>

                        <ToggleButton value={'ALLOWED' as UserRoleAccessType}>
                          <AllowedAccessIcon />
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
