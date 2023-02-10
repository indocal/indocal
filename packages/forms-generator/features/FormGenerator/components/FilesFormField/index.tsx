import { useMemo } from 'react';
import { Stack, Grid, Input, Typography, Badge, Chip } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import Dropzone from 'react-dropzone';

import { Form, FilesFormFieldConfig } from '@indocal/services';

export interface FilesFormFieldProps {
  field: Form['fields'][number];
}

// TODO: implement correctly
export const FilesFormField: React.FC<FilesFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const config = useMemo<FilesFormFieldConfig | null>(
    () => field.config as FilesFormFieldConfig,
    [field.config]
  );

  return (
    <Dropzone multiple={config?.multiple}>
      {({ acceptedFiles, getRootProps, getInputProps }) => (
        <Stack
          sx={{
            display: 'grid',
            gap: (theme) => theme.spacing(1),
            padding: (theme) => theme.spacing(2),
            borderRadius: (theme) => theme.spacing(0.5),
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Badge
            badgeContent="*"
            invisible={!config?.required}
            componentsProps={{ badge: { style: { top: 5, right: -5 } } }}
            sx={{
              width: 'fit-content',
              ...(errors[field.id]?.root && {
                color: (theme) => theme.palette.error.main,
              }),
            }}
          >
            <Typography>{field.title}</Typography>
          </Badge>

          <Stack
            {...getRootProps()}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: (theme) => theme.spacing(6),
              borderRadius: (theme) => theme.spacing(0.5),
              border: (theme) => `1px dashed ${theme.palette.divider}`,

              // backgroundColor: (theme) =>
              //   isFocused
              //     ? theme.palette.success.main
              //     : isDragReject
              //     ? theme.palette.error.main
              //     : isDragActive
              //     ? theme.palette.background.default
              //     : theme.palette.background.paper,
            }}
          >
            <Input inputProps={{ ...getInputProps() }} />

            <Typography align="center">
              Drag drop some files here, or click to select files
            </Typography>
          </Stack>

          <Grid container spacing={1}>
            {acceptedFiles.map((file) => (
              <Grid item key={file.name}>
                <Chip label={file.name} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      )}
    </Dropzone>
  );
};

export default FilesFormField;
