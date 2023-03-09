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
} from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemAnswer,
  SelectFormFieldAnswer,
  SelectFormFieldConfig,
} from '@indocal/services';

export interface SelectItemAnswerProps {
  answer: SectionFormFieldItemAnswer;
}

export const SelectItemAnswer: React.FC<SelectItemAnswerProps> = ({
  answer,
}) => {
  const config = useMemo(
    () => answer.item.config as SelectFormFieldConfig | null,
    [answer]
  );

  const content = useMemo(
    () => answer.content as SelectFormFieldAnswer | null,
    [answer]
  );

  return (
    <Stack
      component={Paper}
      elevation={4}
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
          <Typography variant="h6">{answer.item.title}</Typography>

          {answer.item.description && (
            <Typography
              component="pre"
              variant="caption"
              color="text.secondary"
            >
              {answer.item.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(answer.item.type)} />
      </Stack>

      {typeof content === 'string' || content?.length ? (
        <Stack spacing={1}>
          {typeof content === 'string' ? (
            <FormControlLabel
              label={content}
              control={<Radio disableRipple checked />}
            />
          ) : (
            <RadioGroup row>
              {content.map((option) => (
                <FormControlLabel
                  key={option}
                  label={option}
                  control={<Radio disableRipple checked />}
                />
              ))}
            </RadioGroup>
          )}

          {config?.options && (
            <FormControl
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
        </Stack>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default SelectItemAnswer;