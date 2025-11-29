import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WorkflowBlock } from '../types/workflow';

interface BlockConfigPanelProps {
  block: WorkflowBlock;
  onClose: () => void;
  onUpdate: (updates: Partial<WorkflowBlock>) => void;
}

const BlockConfigPanel: React.FC<BlockConfigPanelProps> = ({ block, onClose, onUpdate }) => {
  const [label, setLabel] = useState(block.label || '');
  const [config, setConfig] = useState(block.config);

  const handleConfigChange = (key: string, value: unknown) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdate({ label, config });
  };

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl border-l border-slate-200 z-10 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Configure Block</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Block label"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Block Configuration</h4>

          {block.blockType === 'api_call' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Method</label>
                <select
                  value={config.method as string || 'GET'}
                  onChange={(e) => handleConfigChange('method', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
                <input
                  type="text"
                  value={config.url as string || ''}
                  onChange={(e) => handleConfigChange('url', e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {block.blockType === 'notification' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={config.type as string || 'email'}
                  onChange={(e) => handleConfigChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="slack">Slack</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                <input
                  type="text"
                  value={config.to as string || ''}
                  onChange={(e) => handleConfigChange('to', e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  value={config.message as string || ''}
                  onChange={(e) => handleConfigChange('message', e.target.value)}
                  placeholder="Your message here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {block.blockType === 'condition' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Field</label>
                <input
                  type="text"
                  value={config.field as string || ''}
                  onChange={(e) => handleConfigChange('field', e.target.value)}
                  placeholder="field_name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Operator</label>
                <select
                  value={config.operator as string || 'equals'}
                  onChange={(e) => handleConfigChange('operator', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="equals">Equals</option>
                  <option value="not_equals">Not Equals</option>
                  <option value="greater_than">Greater Than</option>
                  <option value="less_than">Less Than</option>
                  <option value="contains">Contains</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
                <input
                  type="text"
                  value={config.value as string || ''}
                  onChange={(e) => handleConfigChange('value', e.target.value)}
                  placeholder="comparison value"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {block.blockType === 'loop' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">🔄 Loop Type</label>
                <select
                  value={config.loopType as string || 'count'}
                  onChange={(e) => handleConfigChange('loopType', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="count">Fixed Count (Repeat N times)</option>
                  <option value="array">For Each Item in Array</option>
                  <option value="condition">While Condition is True</option>
                </select>
              </div>

              {(!config.loopType || config.loopType === 'count') && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">🔢 Number of Iterations</label>
                  <input
                    type="number"
                    value={config.iterations as number || 10}
                    onChange={(e) => handleConfigChange('iterations', parseInt(e.target.value))}
                    min="1"
                    max="1000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Loop will repeat this many times</p>
                </div>
              )}

              {config.loopType === 'array' && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">📋 Array Data Source</label>
                    <input
                      type="text"
                      value={config.arraySource as string || ''}
                      onChange={(e) => handleConfigChange('arraySource', e.target.value)}
                      placeholder="database_query.results"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Reference to array from previous block</p>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">🏷️ Current Item Variable</label>
                    <input
                      type="text"
                      value={config.itemVariable as string || 'item'}
                      onChange={(e) => handleConfigChange('itemVariable', e.target.value)}
                      placeholder="item"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Use {'{item}'} in blocks inside the loop</p>
                  </div>
                </>
              )}

              {config.loopType === 'condition' && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">⚡ Loop Condition</label>
                  <input
                    type="text"
                    value={config.condition as string || ''}
                    onChange={(e) => handleConfigChange('condition', e.target.value)}
                    placeholder="counter < 100"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Loop continues while this condition is true</p>
                </div>
              )}

              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">🛡️ Max Iterations (Safety)</label>
                <input
                  type="number"
                  value={config.maxIterations as number || 100}
                  onChange={(e) => handleConfigChange('maxIterations', parseInt(e.target.value))}
                  min="1"
                  max="10000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-slate-500 mt-1">Prevents infinite loops</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-md p-3 text-xs text-purple-800">
                <p className="font-medium mb-2">💡 Loop Examples:</p>
                <p className="mb-1"><strong>Fixed Count:</strong> Send 10 reminder emails</p>
                <p className="mb-1"><strong>Array:</strong> Process each email from database query</p>
                <p><strong>Condition:</strong> Retry API call until success</p>
              </div>
            </>
          )}

          {block.blockType === 'delay' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                <input
                  type="number"
                  value={config.duration as number || 1}
                  onChange={(e) => handleConfigChange('duration', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                <select
                  value={config.unit as string || 'seconds'}
                  onChange={(e) => handleConfigChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </>
          )}

          {block.blockType === 'data_transform' && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Transformation</label>
              <textarea
                value={JSON.stringify(config.operations || [], null, 2)}
                onChange={(e) => {
                  try {
                    handleConfigChange('operations', JSON.parse(e.target.value));
                  } catch (err) {
                    // Handle invalid JSON
                  }
                }}
                placeholder='[{"type": "map", "field": "value"}]'
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {block.blockType === 'trigger' && config.triggerType === 'schedule' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">📅 Schedule Date</label>
                <input
                  type="date"
                  value={config.scheduleDate as string || ''}
                  onChange={(e) => handleConfigChange('scheduleDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">⏰ Schedule Time (IST)</label>
                <input
                  type="time"
                  value={config.scheduleTime as string || ''}
                  onChange={(e) => handleConfigChange('scheduleTime', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">🔄 Repeat</label>
                <select
                  value={config.repeatType as string || 'once'}
                  onChange={(e) => handleConfigChange('repeatType', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-800">
                <p className="font-medium mb-1">🌏 Timezone: Asia/Kolkata (IST)</p>
                <p>Workflow will trigger at the scheduled time in Indian Standard Time</p>
              </div>
            </>
          )}

          {block.blockType === 'action' && block.label?.toLowerCase().includes('database') && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">🗄️ Database Connection</label>
                <select
                  value={config.database as string || 'postgres'}
                  onChange={(e) => handleConfigChange('database', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="postgres">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="sqlite">SQLite</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">📝 SQL Query</label>
                <textarea
                  value={config.query as string || ''}
                  onChange={(e) => handleConfigChange('query', e.target.value)}
                  placeholder="SELECT * FROM users WHERE role = 'manager'"
                  rows={8}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">⚙️ Parameters (JSON)</label>
                <textarea
                  value={JSON.stringify(config.parameters || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      handleConfigChange('parameters', JSON.parse(e.target.value));
                    } catch (err) {
                      // Handle invalid JSON
                    }
                  }}
                  placeholder='{"user_id": "123", "status": "active"}'
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-md p-3 text-xs text-green-800">
                <p className="font-medium mb-1">💡 Query Examples:</p>
                <p className="mb-1">• SELECT: SELECT * FROM users WHERE email = '{'{email}'}'</p>
                <p className="mb-1">• INSERT: INSERT INTO logs (message) VALUES ('{'{message}'}')</p>
                <p className="mb-1">• UPDATE: UPDATE tasks SET status = 'done' WHERE id = '{'{id}'}'</p>
                <p>• DELETE: DELETE FROM temp WHERE created_at {'<'} NOW() - INTERVAL '7 days'</p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockConfigPanel;
