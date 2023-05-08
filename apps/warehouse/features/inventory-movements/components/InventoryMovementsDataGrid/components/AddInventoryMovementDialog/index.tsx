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
  Divider,
} from '@mui/material';
import { TabContext, TabList, TabPanel, LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useFormContext, Control } from 'react-hook-form';

import { ControlledUsersGroupsAutocomplete } from '@indocal/forms-generator';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { useInventoryMovementsDataGrid } from '../../context';

import {
  AddInventoryMovementDialogProvider,
  AddInventoryMovementDialogData,
} from './context';
import {
  InventoryMovementItemsTable,
  ControlledMovementTypeSelect,
} from './components';

const AddInventoryMovementDialog: React.FC = () => {
  const router = useRouter();

  const { isAddInventoryMovementDialogOpen, toggleAddInventoryMovementDialog } =
    useInventoryMovementsDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    watch,
    control,
    handleSubmit,
    reset,
  } = useFormContext<AddInventoryMovementDialogData>();

  const enum Tabs {
    INFO = 'info',
    ITEMS = 'items',
  }

  const [tab, setTab] = useState<Tabs>(Tabs.INFO);

  const type = watch().type;

  const onSubmit = useCallback(
    async (formData: AddInventoryMovementDialogData) => {
      const { movement, error } = await indocal.warehouse.movements.create({
        type: formData.type,
        concept: formData.concept,
        items: formData.items.map((item) => ({
          quantity: Math.trunc(item.quantity),
          supply: item.supply.id,
        })),

        ...(formData.origin &&
          ['TRANSFER', 'DISCHARGE'].includes(type) && {
            origin: formData.origin.id,
          }),

        ...(formData.destination &&
          ['OUTPUT', 'TRANSFER'].includes(type) && {
            destination: formData.destination.id,
          }),
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
        await router.push(`${Pages.INVENTORY_MOVEMENTS}/${movement?.id}`);

        enqueueSnackbar('Movimiento agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddInventoryMovementDialog,
        });
      }
    },
    [router, type, toggleAddInventoryMovementDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleAddInventoryMovementDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleAddInventoryMovementDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleAddInventoryMovementDialog, confirm]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isAddInventoryMovementDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Agregar movimiento</DialogTitle>

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
              <Stack spacing={2} divider={<Divider flexItem />}>
                <Stack spacing={2}>
                  <ControlledMovementTypeSelect
                    required
                    name="type"
                    label="Tipo"
                    control={control as unknown as Control}
                    disabled={isSubmitting}
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
                </Stack>

                {type !== 'ADJUSTMENT' && (
                  <Stack direction="row" spacing={1}>
                    {['TRANSFER', 'DISCHARGE'].includes(type) && (
                      <ControlledUsersGroupsAutocomplete
                        required
                        name="origin"
                        label="Área origen"
                        control={control as unknown as Control}
                        disabled={isSubmitting}
                        autocompleteProps={{ fullWidth: true }}
                      />
                    )}

                    {['OUTPUT', 'TRANSFER'].includes(type) && (
                      <ControlledUsersGroupsAutocomplete
                        required
                        name="destination"
                        label="Área destino"
                        control={control as unknown as Control}
                        disabled={isSubmitting}
                        autocompleteProps={{ fullWidth: true }}
                      />
                    )}
                  </Stack>
                )}
              </Stack>
            </TabPanel>

            <TabPanel
              value={Tabs.ITEMS}
              sx={{ padding: (theme) => theme.spacing(1) }}
            >
              <InventoryMovementItemsTable />
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

const AddInventoryMovementDialogWrapper: React.FC = () => (
  <AddInventoryMovementDialogProvider>
    <AddInventoryMovementDialog />
  </AddInventoryMovementDialogProvider>
);

export { AddInventoryMovementDialogWrapper as AddInventoryMovementDialog };

export default AddInventoryMovementDialogWrapper;
