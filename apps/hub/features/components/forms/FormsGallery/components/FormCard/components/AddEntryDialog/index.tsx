import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent } from '@mui/material';
import { useSnackbar } from 'notistack';

import {
  FormGenerator,
  serializeFormGeneratorAnswers,
  FormGeneratorAnswers,
} from '@indocal/forms-generator';
import { createServiceError, Form } from '@indocal/services';

import { indocal } from '@/lib';

import { useFormCard } from '../../context';

export interface AddEntryDialogProps {
  form: Form;
}

export const AddEntryDialog: React.FC<AddEntryDialogProps> = ({ form }) => {
  const { data: session } = useSession();

  const { isAddEntryDialogOpen, toggleAddEntryDialog } = useFormCard();

  const { enqueueSnackbar } = useSnackbar();

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const handleOnSubmit = useCallback(
    async (answers: FormGeneratorAnswers) => {
      try {
        const data = await serializeFormGeneratorAnswers(answers, indocal);

        const { error } = await indocal.forms.entries.create({
          answers: data,
          form: form.id,
          answeredBy: session?.user.id,
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
          enqueueSnackbar('Respuestas guardadas exitosamente', {
            variant: 'success',
            onEntered: () => setIsSubmitSuccessful(true),
          });
        }
      } catch (exeption) {
        const error = createServiceError(exeption);

        enqueueSnackbar(
          error.details
            ? error.details.reduce(
                (acc, current) => (acc ? `${acc} | ${current}` : current),
                ``
              )
            : error.message,
          { variant: 'error' }
        );
      }
    },
    [form, session?.user.id, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    const answer = window.confirm(
      '¿Estás seguro de que deseas cancelar esta acción?'
    );

    if (answer) toggleAddEntryDialog();
  }, [toggleAddEntryDialog]);

  return (
    <Dialog maxWidth="md" open={isAddEntryDialogOpen} onClose={handleOnClose}>
      <DialogContent dividers>
        <FormGenerator
          form={form}
          showThankYouMessage={isSubmitSuccessful}
          onSubmit={handleOnSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryDialog;
