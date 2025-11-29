import { BlockTemplate } from '../types/workflow';

export const blockTemplates: BlockTemplate[] = [
  {
    id: 'template-1',
    name: 'Manual Trigger',
    description: 'Start workflow manually',
    category: 'Triggers',
    blockType: 'trigger',
    defaultConfig: { triggerType: 'manual' },
    icon: 'play',
    usageCount: 0
  },
  {
    id: 'template-2',
    name: 'Schedule Trigger',
    description: 'Run workflow on a schedule',
    category: 'Triggers',
    blockType: 'trigger',
    defaultConfig: { triggerType: 'schedule', cron: '0 9 * * *' },
    icon: 'clock',
    usageCount: 0
  },
  {
    id: 'template-3',
    name: 'Webhook Trigger',
    description: 'Trigger workflow via HTTP webhook',
    category: 'Triggers',
    blockType: 'trigger',
    defaultConfig: { triggerType: 'webhook', method: 'POST' },
    icon: 'webhook',
    usageCount: 0
  },
  {
    id: 'template-4',
    name: 'Send Email',
    description: 'Send an email notification',
    category: 'Notifications',
    blockType: 'notification',
    defaultConfig: { type: 'email', to: '', subject: '', body: '' },
    icon: 'mail',
    usageCount: 0
  },
  {
    id: 'template-5',
    name: 'HTTP Request',
    description: 'Make an HTTP API call',
    category: 'Integrations',
    blockType: 'api_call',
    defaultConfig: { method: 'GET', url: '', headers: {}, body: {} },
    icon: 'globe',
    usageCount: 0
  },
  {
    id: 'template-6',
    name: 'Condition',
    description: 'Branch based on a condition',
    category: 'Logic',
    blockType: 'condition',
    defaultConfig: { operator: 'equals', field: '', value: '' },
    icon: 'git-branch',
    usageCount: 0
  },
  {
    id: 'template-7',
    name: 'Loop',
    description: 'Repeat actions for each item',
    category: 'Logic',
    blockType: 'loop',
    defaultConfig: { items: [], maxIterations: 100 },
    icon: 'repeat',
    usageCount: 0
  },
  {
    id: 'template-8',
    name: 'Transform Data',
    description: 'Transform or map data',
    category: 'Data',
    blockType: 'data_transform',
    defaultConfig: { operations: [] },
    icon: 'shuffle',
    usageCount: 0
  },
  {
    id: 'template-9',
    name: 'Delay',
    description: 'Wait for a specified duration',
    category: 'Utilities',
    blockType: 'delay',
    defaultConfig: { duration: 1000, unit: 'seconds' },
    icon: 'timer',
    usageCount: 0
  },
  {
    id: 'template-10',
    name: 'Slack Message',
    description: 'Send a message to Slack',
    category: 'Notifications',
    blockType: 'notification',
    defaultConfig: { type: 'slack', channel: '', message: '' },
    icon: 'message-square',
    usageCount: 0
  },
  {
    id: 'template-11',
    name: 'Database Query',
    description: 'Query a database',
    category: 'Data',
    blockType: 'action',
    defaultConfig: { query: '', parameters: {} },
    icon: 'database',
    usageCount: 0
  },
  {
    id: 'template-12',
    name: 'End Workflow',
    description: 'Mark workflow as complete',
    category: 'Utilities',
    blockType: 'end',
    defaultConfig: {},
    icon: 'square',
    usageCount: 0
  }
];
