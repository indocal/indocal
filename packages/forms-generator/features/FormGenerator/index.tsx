import { Fragment, useMemo, useCallback, createElement } from 'react';
import { Paper, Stack, Divider, Typography, Button } from '@mui/material';
import {
  Save as SaveIcon,
  CheckCircle as CheckIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useFormContext } from 'react-hook-form';

import { NoData, Markdown } from '@indocal/ui';
import { Form } from '@indocal/services';

import { FormGeneratorProvider } from './context';
import {
  TextFormField,
  TextAreaFormField,
  NumberFormField,
  DniFormField,
  PhoneFormField,
  EmailFormField,
  CheckboxFormField,
  SelectFormField,
  RadioFormField,
  TimeFormField,
  DateFormField,
  DateTimeFormField,
  RatingFormField,
  NetPromoterScoreFormField,
  SignatureFormField,
  FilesFormField,
  UsersFormField,
  SectionFormField,
  TableFormField,
} from './components';
import {
  parseTextFormFieldAnswer,
  parseTextAreaFormFieldAnswer,
  parseNumberFormFieldAnswer,
  parseDniFormFieldAnswer,
  parsePhoneFormFieldAnswer,
  parseEmailFormFieldAnswer,
  parseCheckboxFormFieldAnswer,
  parseSelectFormFieldAnswer,
  parseRadioFormFieldAnswer,
  parseTimeFormFieldAnswer,
  parseDateFormFieldAnswer,
  parseDateTimeFormFieldAnswer,
  parseRatingFormFieldAnswer,
  parseNetPromoterScoreFormFieldAnswer,
  parseSignatureFormFieldAnswer,
  parseFilesFormFieldAnswer,
  parseUsersFormFieldAnswer,
  parseSectionFormFieldAnswer,
  parseTableFormFieldAnswer,
} from './utils';
import { initialConfig, FormGeneratorConfig } from './config';

export type FormGeneratorFormData = Record<
  string,
  | Parameters<typeof parseTextFormFieldAnswer>[number]['content']
  | Parameters<typeof parseTextAreaFormFieldAnswer>[number]['content']
  | Parameters<typeof parseNumberFormFieldAnswer>[number]['content']
  | Parameters<typeof parseDniFormFieldAnswer>[number]['content']
  | Parameters<typeof parsePhoneFormFieldAnswer>[number]['content']
  | Parameters<typeof parseEmailFormFieldAnswer>[number]['content']
  | Parameters<typeof parseCheckboxFormFieldAnswer>[number]['content']
  | Parameters<typeof parseSelectFormFieldAnswer>[number]['content']
  | Parameters<typeof parseRadioFormFieldAnswer>[number]['content']
  | Parameters<typeof parseTimeFormFieldAnswer>[number]['content']
  | Parameters<typeof parseDateFormFieldAnswer>[number]['content']
  | Parameters<typeof parseDateTimeFormFieldAnswer>[number]['content']
  | Parameters<typeof parseRatingFormFieldAnswer>[number]['content']
  | Parameters<typeof parseNetPromoterScoreFormFieldAnswer>[number]['content']
  | Parameters<typeof parseSignatureFormFieldAnswer>[number]['content']
  | Parameters<typeof parseFilesFormFieldAnswer>[number]['content']
  | Parameters<typeof parseUsersFormFieldAnswer>[number]['content']
  | Parameters<typeof parseSectionFormFieldAnswer>[number]['content']
  | Parameters<typeof parseTableFormFieldAnswer>[number]['content']
>;

export type FormGeneratorAnswers = Array<
  | ReturnType<typeof parseTextFormFieldAnswer>
  | ReturnType<typeof parseTextAreaFormFieldAnswer>
  | ReturnType<typeof parseNumberFormFieldAnswer>
  | ReturnType<typeof parseDniFormFieldAnswer>
  | ReturnType<typeof parsePhoneFormFieldAnswer>
  | ReturnType<typeof parseEmailFormFieldAnswer>
  | ReturnType<typeof parseCheckboxFormFieldAnswer>
  | ReturnType<typeof parseSelectFormFieldAnswer>
  | ReturnType<typeof parseRadioFormFieldAnswer>
  | ReturnType<typeof parseTimeFormFieldAnswer>
  | ReturnType<typeof parseDateFormFieldAnswer>
  | ReturnType<typeof parseDateTimeFormFieldAnswer>
  | ReturnType<typeof parseRatingFormFieldAnswer>
  | ReturnType<typeof parseNetPromoterScoreFormFieldAnswer>
  | ReturnType<typeof parseSignatureFormFieldAnswer>
  | ReturnType<typeof parseFilesFormFieldAnswer>
  | ReturnType<typeof parseUsersFormFieldAnswer>
  | ReturnType<typeof parseSectionFormFieldAnswer>
  | ReturnType<typeof parseTableFormFieldAnswer>
>;

export interface FormGeneratorProps {
  form: Form;
  showThankYouMessage?: boolean;
  config?: FormGeneratorConfig;
  onSubmit: (answers: FormGeneratorAnswers) => void | Promise<void>;
  onReset?: () => void | Promise<void>;
}

const FormGenerator: React.FC<FormGeneratorProps> = ({
  form,
  showThankYouMessage,
  config = initialConfig,
  onSubmit,
  onReset,
}) => {
  const configuration = {
    acceptMultipleResponses:
      config.acceptMultipleResponses ?? initialConfig.acceptMultipleResponses,

    messages: {
      saveResponse:
        config.messages?.saveResponse ?? initialConfig.messages?.saveResponse,

      submitAnotherResponse:
        config.messages?.submitAnotherResponse ??
        initialConfig.messages?.submitAnotherResponse,

      thankYouMessage: {
        title:
          config.messages?.thankYouMessage?.title ??
          initialConfig.messages?.thankYouMessage?.title,

        feedback:
          config.messages?.thankYouMessage?.feedback ??
          initialConfig.messages?.thankYouMessage?.feedback,
      },
    },
  };

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useFormContext();

  const fields = useMemo(
    () => ({
      TEXT: TextFormField,
      TEXTAREA: TextAreaFormField,
      NUMBER: NumberFormField,

      DNI: DniFormField,
      PHONE: PhoneFormField,
      EMAIL: EmailFormField,

      CHECKBOX: CheckboxFormField,
      SELECT: SelectFormField,
      RADIO: RadioFormField,

      TIME: TimeFormField,
      DATE: DateFormField,
      DATETIME: DateTimeFormField,

      RATING: RatingFormField,
      NET_PROMOTER_SCORE: NetPromoterScoreFormField,

      SIGNATURE: SignatureFormField,

      FILES: FilesFormField,

      USERS: UsersFormField,

      SECTION: SectionFormField,
      TABLE: TableFormField,
    }),
    []
  );

  const parsers = useMemo(
    () => ({
      TEXT: parseTextFormFieldAnswer,
      TEXTAREA: parseTextAreaFormFieldAnswer,
      NUMBER: parseNumberFormFieldAnswer,

      DNI: parseDniFormFieldAnswer,
      PHONE: parsePhoneFormFieldAnswer,
      EMAIL: parseEmailFormFieldAnswer,

      CHECKBOX: parseCheckboxFormFieldAnswer,
      SELECT: parseSelectFormFieldAnswer,
      RADIO: parseRadioFormFieldAnswer,

      TIME: parseTimeFormFieldAnswer,
      DATE: parseDateFormFieldAnswer,
      DATETIME: parseDateTimeFormFieldAnswer,

      RATING: parseRatingFormFieldAnswer,
      NET_PROMOTER_SCORE: parseNetPromoterScoreFormFieldAnswer,

      SIGNATURE: parseSignatureFormFieldAnswer,

      FILES: parseFilesFormFieldAnswer,

      USERS: parseUsersFormFieldAnswer,

      SECTION: parseSectionFormFieldAnswer,
      TABLE: parseTableFormFieldAnswer,
    }),
    []
  );

  const handleOnSubmit = useCallback(
    async (formData: FormGeneratorFormData) => {
      const answers = form.fields.map((field) =>
        parsers[field.type]({ field, content: formData[field.id] as null })
      );

      await onSubmit(answers);
    },
    [form.fields, parsers, onSubmit]
  );

  return (
    <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
      {showThankYouMessage ? (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            margin: 'auto',
            padding: (theme) => theme.spacing(8, 4),
          }}
        >
          <CheckIcon fontSize="large" color="success" />

          <Typography variant="h5" align="center" sx={{ fontWeight: 'bolder' }}>
            {configuration.messages?.thankYouMessage?.title}
          </Typography>

          <Typography variant="caption" align="center" color="text.secondary">
            {configuration.messages?.thankYouMessage?.feedback}
          </Typography>

          {configuration.acceptMultipleResponses && onReset && (
            <Button
              variant="contained"
              size="small"
              endIcon={<ResetIcon />}
              onClick={() => reset(async () => await onReset())}
              sx={{ marginTop: (theme) => theme.spacing(1.5) }}
            >
              {configuration.messages?.submitAnotherResponse}
            </Button>
          )}
        </Stack>
      ) : (
        <Stack spacing={1} divider={<Divider flexItem />}>
          <Stack>
            <Typography variant="h5" align="center" fontWeight="bolder">
              {form.title}
            </Typography>

            {form.description && (
              <Typography
                component="pre"
                variant="caption"
                align="center"
                color="text.secondary"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {form.description}
              </Typography>
            )}
          </Stack>

          {form.fields.length > 0 ? (
            <Stack
              component="form"
              noValidate
              spacing={2}
              onSubmit={handleSubmit(handleOnSubmit)}
              sx={{ padding: (theme) => theme.spacing(1) }}
            >
              {form.fields.map((field) => (
                <Fragment key={field.id}>
                  {field.config?.hint?.include &&
                    field.config?.hint?.content &&
                    field.config.hint?.position === 'BEFORE' && (
                      <Markdown>{field.config.hint.content}</Markdown>
                    )}

                  {createElement(fields[field.type], { field })}

                  {field.config?.hint?.include &&
                    field.config?.hint?.content &&
                    field.config.hint?.position === 'AFTER' && (
                      <Markdown>{field.config.hint.content}</Markdown>
                    )}
                </Fragment>
              ))}

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                endIcon={<SaveIcon />}
              >
                {configuration.messages?.saveResponse}
              </LoadingButton>
            </Stack>
          ) : (
            <NoData message="Este formulario no contiene campos" />
          )}
        </Stack>
      )}
    </Paper>
  );
};

const FormGeneratorWrapper: React.FC<FormGeneratorProps> = (props) => (
  <FormGeneratorProvider>
    <FormGenerator {...props} />
  </FormGeneratorProvider>
);

export { FormGeneratorWrapper as FormGenerator };

export { type FormGeneratorConfig };

export default FormGeneratorWrapper;
