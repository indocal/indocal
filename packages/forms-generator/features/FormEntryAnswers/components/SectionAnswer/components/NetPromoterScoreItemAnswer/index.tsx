import { useMemo } from 'react';
import {
  Paper,
  Stack,
  Divider,
  Typography,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemAnswer,
  NetPromoterScoreFormFieldAnswer,
} from '@indocal/services';

export interface NetPromoterScoreItemAnswerProps {
  answer: SectionFormFieldItemAnswer;
}

export const NetPromoterScoreItemAnswer: React.FC<
  NetPromoterScoreItemAnswerProps
> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as NetPromoterScoreFormFieldAnswer | null,
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
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {answer.item.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(answer.item.type)} />
      </Stack>

      {typeof content === 'number' ? (
        <ToggleButtonGroup
          exclusive
          disabled
          value={content}
          sx={{
            flexWrap: 'wrap',
            gap: (theme) => theme.spacing(1),
            marginY: (theme) => theme.spacing(1),
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
            <ToggleButton
              key={option}
              value={option}
              sx={{
                width: 50,
                border: (theme) =>
                  `1px solid ${theme.palette.divider} !important`,
              }}
            >
              {option}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default NetPromoterScoreItemAnswer;
