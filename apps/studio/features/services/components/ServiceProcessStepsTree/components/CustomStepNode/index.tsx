import { Paper, Typography } from '@mui/material';
import { Handle, Position, NodeProps } from 'reactflow';

import { Service } from '@indocal/services';

import { NODE_WIDTH } from '../../config';

export type CustomStepNodeData = {
  label: string;
  step: Service['steps'][number];
};

export const CustomStepNode: React.FC<NodeProps<CustomStepNodeData>> = ({
  selected,
  data,
}) => (
  <>
    <Handle type="target" position={Position.Left} />

    <Paper
      elevation={4}
      sx={{
        width: NODE_WIDTH,
        padding: (theme) => theme.spacing(1),
        textAlign: 'center',
        wordWrap: 'break-word',
        wordBreak: 'break-word',

        color: (theme) =>
          selected
            ? theme.palette.info.contrastText
            : theme.palette.text.primary,

        backgroundColor: (theme) =>
          selected ? theme.palette.info.main : theme.palette.background.paper,
      }}
    >
      <Typography variant="body1">{data.label}</Typography>
    </Paper>

    <Handle type="source" position={Position.Right} />
  </>
);

export default CustomStepNode;
