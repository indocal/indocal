import {
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import { LayoutConfig, BackgroundConfig, QRConfig } from './components';

export const DesignConfig: React.FC = () => (
  <Accordion defaultExpanded>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Diseño</Typography>
    </AccordionSummary>

    <AccordionDetails>
      <Stack spacing={2} divider={<Divider flexItem />}>
        <LayoutConfig />
        <BackgroundConfig />
        <QRConfig />
      </Stack>
    </AccordionDetails>
  </Accordion>
);

export default DesignConfig;
