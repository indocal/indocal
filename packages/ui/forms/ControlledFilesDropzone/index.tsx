import { useMemo } from 'react';
import {
  Stack,
  Grid,
  Divider,
  FormControl,
  FormHelperText,
  Input,
  Chip,
  FormControlProps,
  FormHelperTextProps,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  CloudOff as CloudOffIcon,
  DoDisturb as DoDisturbIcon,
  FilePresent as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
} from '@mui/icons-material';
import { Controller, ControllerProps, Control } from 'react-hook-form';
import Dropzone, { DropzoneProps } from 'react-dropzone';

export interface ControlledFilesDropzoneProps {
  name: string;
  control: Control;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'required' | 'disabled' | 'error'>;
  formHelperTextProps?: FormHelperTextProps;
  dropzoneProps?: Omit<DropzoneProps, 'multiple' | 'disabled'>;
}

export const ControlledFilesDropzone: React.FC<
  ControlledFilesDropzoneProps
> = ({
  name,
  control,
  multiple,
  disabled,
  required,
  controllerProps,
  formControlProps,
  formHelperTextProps,
  dropzoneProps,
}) => {
  const icons = useMemo<Record<string, React.ReactElement>>(
    () => ({
      text: <FileIcon />,
      image: <ImageIcon />,
      video: <VideoIcon />,
      audio: <AudioIcon />,
    }),
    []
  );

  return (
    <Controller
      {...controllerProps}
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Dropzone
          {...dropzoneProps}
          multiple={Boolean(multiple)}
          disabled={disabled}
          onDropAccepted={(files, event) => {
            onChange(files);

            if (dropzoneProps?.onDropAccepted) {
              dropzoneProps.onDropAccepted(files, event);
            }
          }}
        >
          {({ isDragAccept, isDragReject, getRootProps, getInputProps }) => (
            <FormControl
              {...formControlProps}
              required={required}
              disabled={disabled}
              error={Boolean(error)}
            >
              <Stack spacing={1} divider={<Divider flexItem />}>
                <Stack
                  {...getRootProps()}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: (theme) => theme.spacing(6),
                    borderRadius: (theme) => theme.spacing(0.5),
                    opacity: 0.75,

                    border: (theme) =>
                      isDragAccept
                        ? `2px dashed ${theme.palette.success.dark}`
                        : isDragReject
                        ? `2px dashed ${theme.palette.error.dark}`
                        : `2px dashed ${theme.palette.divider}`,

                    backgroundColor: (theme) =>
                      isDragAccept
                        ? theme.palette.success.light
                        : isDragReject
                        ? theme.palette.error.light
                        : theme.palette.action.disabledBackground,
                  }}
                >
                  <Input inputProps={{ ...getInputProps() }} />

                  {isDragAccept ? (
                    <CloudDownloadIcon fontSize="large" />
                  ) : isDragReject ? (
                    <CloudOffIcon fontSize="large" color="error" />
                  ) : error ? (
                    <DoDisturbIcon fontSize="large" color="error" />
                  ) : (
                    <CloudUploadIcon fontSize="large" />
                  )}

                  <FormHelperText
                    sx={{ textAlign: 'center' }}
                    {...formHelperTextProps}
                  >
                    {isDragAccept
                      ? 'Soltar archivos'
                      : isDragReject
                      ? 'Archivos no válidos'
                      : error
                      ? error.message
                      : 'Arrastra y suelta archivos aquí'}
                  </FormHelperText>
                </Stack>

                {value && (
                  <Grid
                    container
                    spacing={1}
                    sx={{
                      padding: (theme) => theme.spacing(0.5),
                      overflow: 'auto',
                    }}
                  >
                    {(value as File[])?.map((file, index) => {
                      const [mime] = file.type.split('/');

                      return (
                        <Grid item key={`${index}-${file.name}`}>
                          <Chip
                            label={file.name}
                            icon={icons[mime] ?? <FileIcon />}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Stack>
            </FormControl>
          )}
        </Dropzone>
      )}
    />
  );
};

export default ControlledFilesDropzone;