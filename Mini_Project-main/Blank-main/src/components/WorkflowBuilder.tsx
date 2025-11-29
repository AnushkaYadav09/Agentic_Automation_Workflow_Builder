import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  NodeChange,
  EdgeChange,
  Connection,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/base.css';
import { useWorkflow } from '../context/WorkflowContext';
import { WorkflowBlock } from '../types/workflow';
import CustomNode from './CustomNode';
import BlockConfigPanel from './BlockConfigPanel';

const nodeTypes = {
  custom: CustomNode
};

const WorkflowBuilder: React.FC = () => {
  const { currentWorkflow, addConnection, deleteConnection, updateBlock, deleteBlock } = useWorkflow();
  const [selectedBlock, setSelectedBlock] = useState<WorkflowBlock | null>(null);

  const nodes: Node[] = currentWorkflow?.blocks.map(block => ({
    id: block.id,
    type: 'custom',
    position: block.position,
    data: {
      block,
      onSelect: () => setSelectedBlock(block),
      onDelete: () => deleteBlock(block.id)
    }
  })) || [];

  const edges: Edge[] = currentWorkflow?.connections.map(conn => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    type: 'smoothstep',
    animated: true,
    label: conn.condition
  })) || [];

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach(change => {
        if (change.type === 'position' && change.position && change.id) {
          updateBlock(change.id, { position: change.position });
        }
      });
    },
    [updateBlock]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      changes.forEach(change => {
        if (change.type === 'remove') {
          deleteConnection(change.id);
        }
      });
    },
    [deleteConnection]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addConnection({
          source: connection.source,
          target: connection.target
        });
      }
    },
    [addConnection]
  );

  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <p className="text-slate-500">Select or create a workflow to get started</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>

      {selectedBlock && (
        <BlockConfigPanel
          block={selectedBlock}
          onClose={() => setSelectedBlock(null)}
          onUpdate={(updates) => {
            updateBlock(selectedBlock.id, updates);
            setSelectedBlock(null);
          }}
        />
      )}
    </div>
  );
};

export default WorkflowBuilder;
