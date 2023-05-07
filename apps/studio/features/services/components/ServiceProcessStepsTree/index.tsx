import { useMemo, useRef } from 'react';
import { Paper } from '@mui/material';
import dagre from 'dagre';
import ReactFlow, { Background, Node, Edge, Position } from 'reactflow';
import 'reactflow/dist/style.css';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useService, UUID, Service } from '@indocal/services';

import { NODE_POSITION, NODE_WIDTH, NODE_HEIGHT } from './config';

type NodeData = {
  label: string;
  step: Service['steps'][number];
};

export interface ServiceProcessStepsTreeProps {
  service: UUID | Service;
  onStepClick?: (event: React.MouseEvent, node: Node<NodeData>) => void;
}

export const ServiceProcessStepsTree: React.FC<
  ServiceProcessStepsTreeProps
> = ({ service: entity, onStepClick }) => {
  const { loading, service, error } = useService(
    typeof entity === 'string' ? entity : entity.id
  );

  const dagreGraphRef = useRef(new dagre.graphlib.Graph());
  dagreGraphRef.current.setGraph({ rankdir: 'LR' });
  dagreGraphRef.current.setDefaultEdgeLabel(() => ({}));

  const { nodes, edges } = useMemo(() => {
    const nodes = service
      ? service.steps.map<Node>((step) => ({
          id: step.id,
          position: NODE_POSITION,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          data: { step, label: step.title },
        }))
      : [];

    const edges = service
      ? service.steps
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
          .flat()
      : [];

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
  }, [service]);

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: (theme) => theme.spacing(2),
      }}
    >
      {loading ? (
        <Loader invisible message="Cargando datos del servicio..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : service ? (
        <ReactFlow
          fitView
          nodes={nodes}
          edges={edges}
          onNodeClick={onStepClick}
        >
          <Background />
        </ReactFlow>
      ) : (
        <NoData message="No se han encontrado datos del servicio" />
      )}
    </Paper>
  );
};

export default ServiceProcessStepsTree;
