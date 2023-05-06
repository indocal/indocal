import { useState, useMemo, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from '@mui/material';
import { AddCircle as AddIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import dagre from 'dagre';
import ReactFlow, { Background, Node, Edge, Position } from 'reactflow';
import 'reactflow/dist/style.css';

import { NoData } from '@indocal/ui';
import { Can, Service } from '@indocal/services';

const NODE_POSITION = { x: 0, y: 0 };
const NODE_WIDTH = 200;
const NODE_HEIGHT = 50;

import { useServiceCard } from '../../context';
import { AddServiceProcessStepDialog, EditServiceProcessStepDialog } from '../';

export interface ManageServiceProcessDialogProps {
  service: Service;
}

export const ManageServiceProcessDialog: React.FC<
  ManageServiceProcessDialogProps
> = ({ service }) => {
  const {
    isManageServiceProcessDialogOpen,
    isAddServiceProcessStepDialogOpen,
    isEditServiceProcessStepDialogOpen,
    toggleManageServiceProcessDialog,
    toggleAddServiceProcessStepDialog,
    toggleEditServiceProcessStepDialog,
  } = useServiceCard();

  const [step, setStep] = useState<Service['steps'][number] | null>(null);

  const handleEdit = useCallback(
    (step: Service['steps'][number]) => {
      setStep(step);
      toggleEditServiceProcessStepDialog();
    },
    [toggleEditServiceProcessStepDialog]
  );

  const handleOnClose = useCallback(() => {
    setStep(null);
    toggleManageServiceProcessDialog();
  }, [toggleManageServiceProcessDialog]);

  const dagreGraphRef = useRef(new dagre.graphlib.Graph());
  dagreGraphRef.current.setGraph({ rankdir: 'LR' });
  dagreGraphRef.current.setDefaultEdgeLabel(() => ({}));

  const { nodes, edges } = useMemo(() => {
    const nodes = service.steps.map<Node>((step) => ({
      id: step.id,
      position: NODE_POSITION,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: { step, label: step.title },
    }));

    const edges = service.steps
      .map<Edge[]>((step) => {
        const edges: Edge[] = [];

        if (step.nextStepOnApprove) {
          edges.push({
            id: `${step.id}-${step.nextStepOnApprove.id}`,
            type: 'step',
            source: step.id,
            target: step.nextStepOnApprove.id,
            label: 'Aprobado',
            animated: true,
            style: { stroke: 'green' },
          });
        }

        if (step.nextStepOnReject) {
          edges.push({
            id: `${step.id}-${step.nextStepOnReject.id}`,
            type: 'step',
            source: step.id,
            target: step.nextStepOnReject.id,
            label: 'Rechazado',
            animated: true,
            style: { stroke: 'red' },
          });
        }

        return edges;
      })
      .flat();

    if (dagreGraphRef.current) {
      nodes.forEach((node) => {
        dagreGraphRef.current.setNode(node.id, {
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
        });
      });

      edges.forEach((edge) => {
        dagreGraphRef.current.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraphRef.current);

      nodes.forEach((node) => {
        const nodeWithPosition = dagreGraphRef.current.node(node.id);

        node.targetPosition = Position.Left;
        node.sourcePosition = Position.Right;

        node.position = {
          x: nodeWithPosition.x - NODE_WIDTH / 2,
          y: nodeWithPosition.y - NODE_HEIGHT / 2,
        };
      });
    }

    return { nodes, edges };
  }, [service.steps]);

  return (
    <>
      {isAddServiceProcessStepDialogOpen && (
        <AddServiceProcessStepDialog service={service} />
      )}

      {isEditServiceProcessStepDialogOpen && step && (
        <EditServiceProcessStepDialog service={service} step={step} />
      )}

      <Dialog
        fullScreen
        open={isManageServiceProcessDialogOpen}
        onClose={handleOnClose}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: (theme) => theme.spacing(1),
          }}
        >
          <Typography fontWeight="bolder">Administrar procesos</Typography>

          <Can I="create" a="service">
            <IconButton onClick={toggleAddServiceProcessStepDialog}>
              <AddIcon />
            </IconButton>
          </Can>
        </DialogTitle>

        <DialogContent dividers sx={{ padding: (theme) => theme.spacing(1) }}>
          {service.steps.length > 0 ? (
            <ReactFlow
              fitView
              nodes={nodes}
              edges={edges}
              onNodeClick={(_, node) => handleEdit(node.data.step)}
            >
              <Background />
            </ReactFlow>
          ) : (
            <NoData message="Pasos aun sin definir" />
          )}
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            onClick={toggleManageServiceProcessDialog}
          >
            Finalizar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageServiceProcessDialog;
