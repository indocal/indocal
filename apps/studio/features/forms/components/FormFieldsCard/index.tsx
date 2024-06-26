import { useMemo, useCallback } from 'react';
import {
  Paper,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Typography,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  ContentCopy as CopyToClipboardIcon,
  FactCheck as ManageFormFields,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { Can, useForm, UUID, Form } from '@indocal/services';

import { FormFieldsCardProvider, useFormFieldsCard } from './context';
import { ManageFormFieldsDialog } from './components';

export interface FormFieldsCardProps {
  form: UUID | Form;
}

const FormFieldsCard: React.FC<FormFieldsCardProps> = ({ form: entity }) => {
  const { loading, validating, form, error } = useForm(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isManageFormFieldsDialogOpen, toggleManageFormFieldsDialog } =
    useFormFieldsCard();

  const { enqueueSnackbar } = useSnackbar();

  const url = useMemo(
    () =>
      new URL(
        `public/forms/${form?.id}`,
        process.env.NEXT_PUBLIC_USER_SITE_URL
      ),
    [form?.id]
  );

  const handleCopyToClipboard = useCallback(async () => {
    try {
      if (form) {
        await navigator.clipboard.writeText(url.toString());

        enqueueSnackbar('Enlace copiado', {
          variant: 'info',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } catch {
      enqueueSnackbar('Error al copiar el enlace', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    }
  }, [form, url, enqueueSnackbar]);

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : form ? (
        <>
          {isManageFormFieldsDialogOpen && (
            <ManageFormFieldsDialog form={form} />
          )}

          {validating && (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: (theme) => theme.zIndex.modal - 1,
                width: '100%',
                borderTopLeftRadius: (theme) => theme.shape.borderRadius,
                borderTopRightRadius: (theme) => theme.shape.borderRadius,
              }}
            />
          )}

          <List
            disablePadding
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            <ListSubheader
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
                Campos del formulario
              </Typography>

              <Tooltip title="Copiar enlace">
                <IconButton size="small" onClick={handleCopyToClipboard}>
                  <CopyToClipboardIcon />
                </IconButton>
              </Tooltip>
            </ListSubheader>

            <ListItem dense divider>
              <ListItemText
                primary="Enlance del formulario"
                secondary={url.toString()}
              />
            </ListItem>

            <ListItem dense divider>
              <ListItemText
                primary="Campos"
                secondary={
                  form.fields.length > 0
                    ? `El formulario contiene ${form.fields.length} campos`
                    : 'N/A'
                }
              />
            </ListItem>

            <Can I="update" a="form">
              <ListItem sx={{ marginTop: 'auto' }}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  endIcon={<ManageFormFields />}
                  onClick={toggleManageFormFieldsDialog}
                >
                  Administrar campos
                </Button>
              </ListItem>
            </Can>
          </List>
        </>
      ) : (
        <NoData message="No se han encontrado datos del formulario" />
      )}
    </Paper>
  );
};

const FormFieldsCardWrapper: React.FC<FormFieldsCardProps> = (props) => (
  <FormFieldsCardProvider>
    <FormFieldsCard {...props} />
  </FormFieldsCardProvider>
);

export { FormFieldsCardWrapper as FormFieldsCard };

export default FormFieldsCardWrapper;
