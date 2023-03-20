import { useMemo } from 'react';
import {
  Paper,
  Stack,
  Divider,
  Typography,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore as ViewOptionsIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldAnswer,
  RadioFormFieldAnswer,
  RadioFormFieldConfig,
} from '@indocal/services';

export interface RadioAnswerProps {
  answer: FormFieldAnswer;
}

export const RadioAnswer: React.FC<RadioAnswerProps> = ({ answer }) => {
  const config = useMemo(
    () => answer.field.config as RadioFormFieldConfig | null,
    [answer]
  );

  const content = useMemo(
    () => answer.content as RadioFormFieldAnswer | null,
    [answer]
  );

  return (
    <Stack
      component={Paper}
      spacing={1}
      divider={<Divider flexItem />}
      sx={{ padding: (theme) => theme.spacing(2) }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
      >
        <Stack>
          <Typography variant="h6">{answer.field.title}</Typography>

          {answer.field.description && (
            <Typography
              component="pre"
              variant="caption"
              color="text.secondary"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {answer.field.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(answer.field.type)} />
      </Stack>

      {content ? (
        <Accordion disableGutters sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ViewOptionsIcon />}>
            <FormControlLabel
              label={content}
              control={<Radio disableRipple checked={Boolean(content)} />}
            />
          </AccordionSummary>

          <AccordionDetails>
            {config?.options && (
              <FormControl
                fullWidth
                disabled
                sx={{
                  paddingTop: (theme) => theme.spacing(1),
                  borderTop: (theme) => `1px dashed ${theme.palette.divider}`,
                }}
              >
                <FormLabel>Opciones</FormLabel>

                <RadioGroup row>
                  {config.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      label={option}
                      control={<Radio checked={false} />}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </AccordionDetails>
        </Accordion>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default RadioAnswer;
