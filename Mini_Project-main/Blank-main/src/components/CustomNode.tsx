import React from 'react';
import { Handle, Position } from 'reactflow';
import {
  Play,
  Mail,
  Globe,
  GitBranch,
  Repeat,
  Shuffle,
  Timer,
  MessageSquare,
  Database,
  Square,
  Clock,
  Zap,
  X
} from 'lucide-react';
import { WorkflowBlock } from '../types/workflow';

interface CustomNodeProps {
  data: {
    block: WorkflowBlock;
    onSelect: () => void;
    onDelete: () => void;
  };
}

const iconMap: Record<string, React.ReactNode> = {
  play: <Play size={16} />,
  mail: <Mail size={16} />,
  globe: <Globe size={16} />,
  'git-branch': <GitBranch size={16} />,
  repeat: <Repeat size={16} />,
  shuffle: <Shuffle size={16} />,
  timer: <Timer size={16} />,
  'message-square': <MessageSquare size={16} />,
  database: <Database size={16} />,
  square: <Square size={16} />,
  clock: <Clock size={16} />,
  webhook: <Zap size={16} />
};

const getNodeColor = (blockType: string): string => {
  const colors: Record<string, string> = {
    trigger: 'bg-emerald-500',
    action: 'bg-blue-500',
    condition: 'bg-amber-500',
    loop: 'bg-purple-500',
    api_call: 'bg-cyan-500',
    data_transform: 'bg-teal-500',
    notification: 'bg-rose-500',
    delay: 'bg-slate-500',
    end: 'bg-gray-700'
  };
  return colors[blockType] || 'bg-blue-500';
};

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  const { block, onSelect, onDelete } = data;

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-lg shadow-lg border-2 border-slate-200 hover:border-slate-400 transition-all cursor-pointer min-w-[180px] group relative"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center shadow-md hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 hidden group-hover:flex z-10"
        title="Delete block"
      >
        <X size={14} />
      </button>

      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className={`${getNodeColor(block.blockType)} text-white px-4 py-2 rounded-t-md flex items-center gap-2`}>
        {block.config.icon && typeof block.config.icon === 'string' && iconMap[block.config.icon] ? iconMap[block.config.icon] : <Globe size={16} />}
        <span className="font-medium text-sm">{block.label || block.blockType}</span>
      </div>

      <div className="px-4 py-3 text-xs text-slate-600">
        {block.blockType === 'api_call' && (
          <div>
            <span className="font-semibold">{(block.config.method as string) || 'GET'}</span>
            <div className="truncate">{block.config.url as string || 'Configure URL'}</div>
          </div>
        )}
        {block.blockType === 'notification' && (
          <div>
            <span className="font-semibold">{block.config.type as string || 'email'}</span>
            <div className="truncate">{block.config.to as string || 'Configure recipient'}</div>
          </div>
        )}
        {block.blockType === 'condition' && (
          <div>
            <span className="font-semibold">If</span> {block.config.field as string || 'field'}{' '}
            {block.config.operator as string || '=='}
          </div>
        )}
        {block.blockType === 'delay' && (
          <div>
            Wait {block.config.duration as number || 1} {block.config.unit as string || 'seconds'}
          </div>
        )}
        {!['api_call', 'notification', 'condition', 'delay'].includes(block.blockType) && (
          <div className="text-slate-400">Click to configure</div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default CustomNode;
