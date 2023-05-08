import { useCallback } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListSubheader,
  ListItem,
  ListItemSecondaryAction,
  ListItemIcon,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import {
  AddCircle as AddIcon,
  RemoveCircle as RemoveIcon,
  ArrowDropUp as ArrowUpIcon,
  ArrowDropDown as ArrowDownIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { NoData } from '@indocal/ui';
import { Can, Form, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useFormCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    webhooks: zod
      .object(
        {
          name: zod
            .string({
              description: 'Nombre del webhook',
              required_error: 'Debe ingresar el nombre del webhook',
              invalid_type_error: 'Formato no válido',
            })
            .min(1, 'Debe ingresar el nombre del webhook'),

          url: zod
            .string({
              description: 'URL del webhook',
              required_error: 'Debe ingresar la URL del webhook',
              invalid_type_error: 'Formato no válido',
            })
            .url('Debe ingresar una URL válida'),
        },
        {
          description: 'Datos del webhook',
          required_error: 'Debe ingresar los datos del webhook',
          invalid_type_error: 'Formato no válido',
        }
      )
      .array(),
  },
  {
    description: 'Configuración del formulario',
    required_error: 'Debe ingresar la configuración del formulario',
    invalid_type_error: 'Formato no válido',
  }
);

export interface ManageFormConfigDialogProps {
  form: Form;
}

export const ManageFormConfigDialog: React.FC<ManageFormConfigDialogProps> = ({
  form,
}) => {
  const { mutate } = useSWRConfig();

  const { isManageFormConfigDialogOpen, toggleManageFormConfigDialog } =
    useFormCard();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      webhooks: form.config?.webhooks,
    },
  });

  const {
    fields: webhooks,
    append,
    swap,
    remove,
  } = useFieldArray({
    control,
    name: 'webhooks',
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error, form: updated } = await indocal.forms.update(form.id, {
        config: {
          ...form.config,
          webhooks: formData.webhooks,
        },
      });

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
        await mutate(`${ApiEndpoints.FORMS}/${form.id}`, updated);

        enqueueSnackbar('Configuración actualizada exitosamente', {
          variant: 'success',
          onEntered: toggleManageFormConfigDialog,
        });
      }
    },
    [
      form.id,
      form.config,
      mutate,
      toggleManageFormConfigDialog,
      enqueueSnackbar,
    ]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleManageFormConfigDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleManageFormConfigDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleManageFormConfigDialog, confirm]);

  return (
    <Dialog
      fullWidth
      open={isManageFormConfigDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Configuración del formulario</DialogTitle>

      <DialogContent dividers>
        <List
          sx={{
            borderRadius: (theme) => theme.shape.borderRadius,
            backgroundColor: (theme) => theme.palette.background.paper,
            ...(errors.webhooks && {
              border: (theme) => `1px solid ${theme.palette.error.main}`,
            }),
          }}
        >
          <ListSubheader
            disableSticky
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: (theme) => theme.spacing(1),
              padding: (theme) => theme.spacing(1.5, 2),
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" fontWeight="bolder">
              Webhooks
            </Typography>

            <IconButton
              size="small"
              disabled={isSubmitting}
              onClick={() => append({ name: '', url: '' })}
            >
              <AddIcon />
            </IconButton>
          </ListSubheader>

          {webhooks.length > 0 ? (
            webhooks.map((webhook, index) => (
              <ListItem key={webhook.id} divider>
                <ListItemIcon
                  sx={{
                    gap: (theme) => theme.spacing(0.5),
                    paddingRight: (theme) => theme.spacing(2.5),
                  }}
                >
                  <IconButton
                    edge="end"
                    size="small"
                    disabled={isSubmitting || index === 0}
                    onClick={() => swap(index, index - 1)}
                  >
                    <ArrowUpIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    edge="start"
                    size="small"
                    disabled={isSubmitting || webhooks.length - 1 === index}
                    onClick={() => swap(index, index + 1)}
                  >
                    <ArrowDownIcon fontSize="small" />
                  </IconButton>
                </ListItemIcon>

                <Stack
                  spacing={2}
                  sx={{
                    width: '100%',
                    marginY: (theme) => theme.spacing(1),
                  }}
                >
                  <TextField
                    required
                    fullWidth
                    size="small"
                    margin="dense"
                    autoComplete="off"
                    label={`Nombre (Webhook ${index + 1})`}
                    disabled={isSubmitting}
                    inputProps={register(`webhooks.${index}.name`)}
                    error={
                      errors.webhooks &&
                      errors.webhooks[index] &&
                      Boolean(errors.webhooks[index]?.name)
                    }
                    helperText={
                      errors.webhooks &&
                      errors.webhooks[index] &&
                      errors.webhooks[index]?.name?.message
                    }
                  />

                  <TextField
                    required
                    fullWidth
                    size="small"
                    margin="dense"
                    autoComplete="off"
                    label={`URL (Webhook ${index + 1})`}
                    disabled={isSubmitting}
                    inputProps={register(`webhooks.${index}.url`)}
                    error={
                      errors.webhooks &&
                      errors.webhooks[index] &&
                      Boolean(errors.webhooks[index]?.url)
                    }
                    helperText={
                      errors.webhooks &&
                      errors.webhooks[index] &&
                      errors.webhooks[index]?.url?.message
                    }
                  />
                </Stack>

                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={isSubmitting}
                    onClick={() => remove(index)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <NoData message="No hay webhooks registrados" />
          )}
        </List>
      </DialogContent>

      <Can I="update" a="form">
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

export default ManageFormConfigDialog;
