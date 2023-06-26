import { useMemo } from 'react';
import {
  Stack,
  Unstable_Grid2,
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
  description?: string | null;
  control: Control;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: 'small' | 'normal';
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'required' | 'disabled' | 'error'>;
  formHelperTextProps?: FormHelperTextProps;
  dropzoneProps?: Omit<DropzoneProps, 'multiple' | 'disabled'>;
}

export const ControlledFilesDropzone: React.FC<
  ControlledFilesDropzoneProps
> = ({
  name,
  description,
  control,
  multiple,
  disabled,
  required,
  size,
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
                    borderRadius: (theme) => theme.spacing(0.5),
                    opacity: 0.75,

                    padding: (theme) =>
                      size === 'small' ? theme.spacing(1) : theme.spacing(6),

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
                    {...formHelperTextProps}
                    sx={{ textAlign: 'center', ...formHelperTextProps?.sx }}
                  >
                    {isDragAccept
                      ? 'Soltar archivos'
                      : isDragReject
                      ? 'Archivos no válidos'
                      : error
                      ? error.message
                      : description || 'Arrastra y suelta archivos aquí'}
                  </FormHelperText>
                </Stack>

                {value && (
                  <Unstable_Grid2
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
                        <Unstable_Grid2 key={`${index}-${file.name}`}>
                          <Chip
                            label={file.name}
                            icon={icons[mime] ?? <FileIcon />}
                          />
                        </Unstable_Grid2>
                      );
                    })}
                  </Unstable_Grid2>
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
