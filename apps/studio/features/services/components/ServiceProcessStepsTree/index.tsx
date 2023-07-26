import { useMemo } from 'react';
import { Paper } from '@mui/material';
import dagre from 'dagre';
import ReactFlow, {
  Background,
  Controls,
  Node,
  NodeTypes,
  Edge,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useService, UUID, Service } from '@indocal/services';

import { CustomStepNode, CustomStepNodeData } from './components';
import { NODE_POSITION, NODE_WIDTH, NODE_HEIGHT } from './config';

export interface ServiceProcessStepsTreeProps {
  service: UUID | Service;
  selectedStep?: UUID | Service['steps'][number];
  onStepClick?: (
    event: React.MouseEvent,
    node: Node<CustomStepNodeData>
  ) => void;
}

export const ServiceProcessStepsTree: React.FC<
  ServiceProcessStepsTreeProps
> = ({ service: entity, selectedStep, onStepClick }) => {
  const { loading, service, error } = useService(
    typeof entity === 'string' ? entity : entity.id
  );

  const nodeTypes: NodeTypes = useMemo(
    () => ({ ['custom-step']: CustomStepNode }),
    []
  );

  const { nodes, edges } = useMemo(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setGraph({ rankdir: 'LR' });
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodes = service
      ? service.steps.map<Node>((step) => ({
          id: step.id,
          draggable: false,
          selectable: false,
          type: 'custom-step',
          position: NODE_POSITION,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          data: { step, label: step.title },
          ...(selectedStep && {
            selected:
              typeof selectedStep === 'string'
                ? selectedStep === step.id
                : selectedStep.id === step.id,
          }),
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
                animated: true,
                style: { stroke: 'red' },
              });
            }

            return edges;
          })
          .flat()
      : [];

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);

      node.targetPosition = Position.Left;
      node.sourcePosition = Position.Right;

      node.position = {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      };
    });

    return { nodes, edges };
  }, [selectedStep, service]);

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: (theme) => theme.spacing(1),
      }}
    >
      {loading ? (
        <Loader invisible message="Cargando datos del servicio..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : service ? (
        <ReactFlow
          fitView
          attributionPosition="top-right"
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodeClick={onStepClick}
        >
          <Background />

          <Controls showZoom={false} showInteractive={false} />
        </ReactFlow>
      ) : (
        <NoData message="No se han encontrado datos del servicio" />
      )}
    </Paper>
  );
};

export default ServiceProcessStepsTree;
