import { useState } from 'react';
import {
  Stack,
  Divider,
  Tab,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
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
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useFormContext, useFieldArray, Control } from 'react-hook-form';

import { NoData } from '@indocal/ui';

import { EditPlaceholderDialogData } from '../../context';

import { ControlledServiceCertificateTemplateSectionPlaceholderItemTypeSelect } from './components';

export const SectionPlaceholderConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditPlaceholderDialogData>();

  const {
    fields: items,
    append,
    swap,
    remove,
  } = useFieldArray({
    name: 'config.items',
  });

  const enum Tabs {
    INFO = 'info',
    CONFIG = 'config',
  }

  const [tab, setTab] = useState<Tabs>(Tabs.INFO);

  return (
    <TabContext value={tab}>
      <TabList
        variant="fullWidth"
        onChange={(_, value) => setTab(value)}
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Tab label="Información" value={Tabs.INFO} />
        <Tab label="Configuración" value={Tabs.CONFIG} />
      </TabList>

      <TabPanel value={Tabs.INFO}>
        <Stack spacing={2} divider={<Divider flexItem />}>
          <Stack spacing={2}>
            <TextField
              required
              autoComplete="off"
              label="Nombre"
              disabled={isSubmitting}
              inputProps={register('name')}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />

            <TextField
              required
              autoComplete="off"
              label="Título"
              disabled={isSubmitting}
              inputProps={register('title')}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
          </Stack>
        </Stack>
      </TabPanel>

      <TabPanel value={Tabs.CONFIG}>
        <List
          sx={{
            borderRadius: (theme) => theme.shape.borderRadius,
            backgroundColor: (theme) => theme.palette.background.paper,
            ...(errors.config?.items && {
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
              Campos
            </Typography>

            <IconButton
              size="small"
              disabled={isSubmitting}
              onClick={() => append({ type: 'TEXT' })}
            >
              <AddIcon />
            </IconButton>
          </ListSubheader>

          {items.length > 0 ? (
            items.map((item, index) => (
              <ListItem key={item.id} divider>
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
                    disabled={isSubmitting || items.length - 1 === index}
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

                    ...(errors?.config?.items &&
                      errors.config.items[index] && {
                        padding: (theme) => theme.spacing(2),
                        border: (theme) =>
                          `1px dashed ${theme.palette.error.main}`,
                      }),
                  }}
                >
                  <ControlledServiceCertificateTemplateSectionPlaceholderItemTypeSelect
                    required
                    name={`config.items.${index}.type`}
                    label={`Tipo (Campo ${index + 1})`}
                    control={control as unknown as Control}
                    disabled={isSubmitting}
                    formControlProps={{ size: 'small' }}
                  />

                  <TextField
                    required
                    fullWidth
                    size="small"
                    margin="dense"
                    autoComplete="off"
                    label={`Nombre (Campo ${index + 1})`}
                    disabled={isSubmitting}
                    inputProps={register(`config.items.${index}.name`)}
                    error={
                      errors.config?.items &&
                      errors.config.items[index] &&
                      Boolean(errors.config.items[index]?.name)
                    }
                    helperText={
                      errors.config?.items &&
                      errors.config.items[index] &&
                      errors.config.items[index]?.name?.message
                    }
                  />

                  <TextField
                    required
                    fullWidth
                    size="small"
                    margin="dense"
                    autoComplete="off"
                    label={`Título (Campo ${index + 1})`}
                    disabled={isSubmitting}
                    inputProps={register(`config.items.${index}.title`)}
                    error={
                      errors.config?.items &&
                      errors.config.items[index] &&
                      Boolean(errors.config.items[index]?.title)
                    }
                    helperText={
                      errors.config?.items &&
                      errors.config.items[index] &&
                      errors.config.items[index]?.title?.message
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
            <NoData message="Debe definir al menos un campo" />
          )}
        </List>
      </TabPanel>
    </TabContext>
  );
};

export default SectionPlaceholderConfig;
