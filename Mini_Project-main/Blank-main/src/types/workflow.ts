export type BlockType =
  | 'trigger'
  | 'action'
  | 'condition'
  | 'loop'
  | 'api_call'
  | 'data_transform'
  | 'notification'
  | 'delay'
  | 'end';

export type TriggerType = 'manual' | 'schedule' | 'webhook' | 'event';

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface WorkflowBlock {
  id: string;
  workflowId: string;
  blockType: BlockType;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  label?: string;
}

export interface WorkflowConnection {
  id: string;
  workflowId: string;
  source: string;
  target: string;
  condition?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggerType: TriggerType;
  triggerConfig: Record<string, unknown>;
  blocks: WorkflowBlock[];
  connections: WorkflowConnection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  triggerSource: string;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  executionData: Record<string, unknown>;
  logs: ExecutionLog[];
}

export interface ExecutionLog {
  id: string;
  executionId: string;
  blockId?: string;
  logLevel: LogLevel;
  message: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

export interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  blockType: BlockType;
  defaultConfig: Record<string, unknown>;
  icon: string;
  usageCount: number;
}

export interface AISuggestion {
  id: string;
  workflowId: string;
  suggestionType: 'optimization' | 'error_handling' | 'new_block' | 'connection';
  title: string;
  description: string;
  suggestedConfig?: Record<string, unknown>;
  isApplied: boolean;
  createdAt: Date;
}
