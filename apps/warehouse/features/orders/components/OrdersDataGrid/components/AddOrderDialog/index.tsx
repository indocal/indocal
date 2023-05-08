import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
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
import { useFormContext, Control } from 'react-hook-form';

import {
  ControlledSuppliersAutocomplete,
  ControlledUsersGroupsAutocomplete,
} from '@indocal/forms-generator';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { useOrdersDataGrid } from '../../context';

import { AddOrderDialogProvider, AddOrderDialogData } from './context';
import { OrderItemsTable } from './components';

const AddOrderDialog: React.FC = () => {
  const router = useRouter();

  const { isAddOrderDialogOpen, toggleAddOrderDialog } = useOrdersDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useFormContext<AddOrderDialogData>();

  const enum Tabs {
    INFO = 'info',
    ITEMS = 'items',
  }

  const [tab, setTab] = useState<Tabs>(Tabs.INFO);

  const onSubmit = useCallback(
    async (formData: AddOrderDialogData) => {
      const { order, error } = await indocal.warehouse.orders.create({
        code: formData.code,
        concept: formData.concept,
        supplier: formData.supplier.id,
        requestedBy: formData.requestedBy.id,
        items: formData.items.map((item) => ({
          price: item.price,
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
        await router.push(`${Pages.ORDERS}/${order?.id}`);

        enqueueSnackbar('Orden agregada exitosamente', {
          variant: 'success',
          onEntered: toggleAddOrderDialog,
        });
      }
    },
    [router, toggleAddOrderDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleAddOrderDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleAddOrderDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleAddOrderDialog, confirm]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isAddOrderDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Agregar orden</DialogTitle>

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
                  autoComplete="off"
                  label="Código"
                  disabled={isSubmitting}
                  inputProps={register('code')}
                  error={Boolean(errors.code)}
                  helperText={errors.code?.message}
                />

                <TextField
                  required
                  multiline
                  autoComplete="off"
                  label="Concepto"
                  disabled={isSubmitting}
                  inputProps={register('concept')}
                  error={Boolean(errors.concept)}
                  helperText={errors.concept?.message}
                />

                <ControlledSuppliersAutocomplete
                  required
                  name="supplier"
                  label="Suplidor"
                  control={control as unknown as Control}
                  disabled={isSubmitting}
                />

                <ControlledUsersGroupsAutocomplete
                  required
                  name="requestedBy"
                  label="Solicitante"
                  control={control as unknown as Control}
                  disabled={isSubmitting}
                />
              </Stack>
            </TabPanel>

            <TabPanel
              value={Tabs.ITEMS}
              sx={{ padding: (theme) => theme.spacing(1) }}
            >
              <OrderItemsTable />
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

const AddOrderDialogWrapper: React.FC = () => (
  <AddOrderDialogProvider>
    <AddOrderDialog />
  </AddOrderDialogProvider>
);

export { AddOrderDialogWrapper as AddOrderDialog };

export default AddOrderDialogWrapper;
