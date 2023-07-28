import { Stack, TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { EditPlaceholderDialogData } from '../../context';

export const SignaturePlaceholderConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext<EditPlaceholderDialogData>();

  return (
    <Stack spacing={2} sx={{ padding: (theme) => theme.spacing(2) }}>
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
  );
};

export default SignaturePlaceholderConfig;
