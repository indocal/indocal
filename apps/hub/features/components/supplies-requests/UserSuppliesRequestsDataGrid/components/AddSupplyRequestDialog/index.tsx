import { useState, useCallback } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  TextField,
} from '@mui/material';
import { TabContext, TabList, TabPanel, LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useFormContext } from 'react-hook-form';

import { UUID, User, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useUserSuppliesRequestsDataGrid } from '../../context';

import {
  AddSupplyRequestDialogProvider,
  AddSupplyRequestDialogData,
} from './context';
import { SupplyRequestItemsTable } from './components';

export interface AddSupplyRequestDialogProps {
  user: UUID | User;
}

const AddSupplyRequestDialog: React.FC<AddSupplyRequestDialogProps> = ({
  user,
}) => {
  const { mutate } = useSWRConfig();

  const { isAddSupplyRequestDialogOpen, toggleAddSupplyRequestDialog } =
    useUserSuppliesRequestsDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useFormContext<AddSupplyRequestDialogData>();

  const enum Tabs {
    INFO = 'info',
    ITEMS = 'items',
  }

  const [tab, setTab] = useState<Tabs>(Tabs.INFO);

  const onSubmit = useCallback(
    async (formData: AddSupplyRequestDialogData) => {
      const { error } = await indocal.warehouse.requests.create({
        requestedBy: typeof user === 'string' ? user : user.id,
        description: formData.description,
        items: formData.items.map((item) => ({
          quantity: Math.abs(Math.trunc(item.quantity)),
          supply: item.supply.id,
        })),
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
        await mutate(
          (key) =>
            typeof key === 'string' &&
            key.startsWith(ApiEndpoints.SUPPLIES_REQUESTS) &&
            key.includes(typeof user === 'string' ? user : user.id)
        );

        enqueueSnackbar('Solicitud enviada exitosamente', {
          variant: 'success',
          onEntered: toggleAddSupplyRequestDialog,
        });
      }
    },
    [user, mutate, toggleAddSupplyRequestDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleAddSupplyRequestDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleAddSupplyRequestDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleAddSupplyRequestDialog, confirm]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isAddSupplyRequestDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Agregar solicitud</DialogTitle>

      <DialogContent dividers sx={{ padding: 0 }}>
        <Stack component="form" autoComplete="off">
          <TabContext value={tab}>
            <TabList
              variant="fullWidth"
              onChange={(_, value) => setTab(value)}
              sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
              }}
            >
              <Tab label="Información" value={Tabs.INFO} />
              <Tab label="Artículos" value={Tabs.ITEMS} />
            </TabList>

            <TabPanel value={Tabs.INFO}>
              <Stack spacing={2}>
                <TextField
                  required
                  multiline
                  autoComplete="off"
                  label="Descripción"
                  disabled={isSubmitting}
                  inputProps={register('description')}
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              </Stack>
            </TabPanel>

            <TabPanel
              value={Tabs.ITEMS}
              sx={{ padding: (theme) => theme.spacing(1) }}
            >
              <SupplyRequestItemsTable />
            </TabPanel>
          </TabContext>
        </Stack>
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
          Agregar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const AddSupplyRequestDialogWrapper: React.FC<AddSupplyRequestDialogProps> = (
  props
) => (
  <AddSupplyRequestDialogProvider>
    <AddSupplyRequestDialog {...props} />
  </AddSupplyRequestDialogProvider>
);

export { AddSupplyRequestDialogWrapper as AddSupplyRequestDialog };

export default AddSupplyRequestDialogWrapper;
