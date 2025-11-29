import React, { useState } from 'react';
import { Plus, Play, Trash2, Power, PowerOff } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

const WorkflowList: React.FC = () => {
  const {
    workflows,
    currentWorkflow,
    createWorkflow,
    setCurrentWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow
  } = useWorkflow();
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  const handleCreate = () => {
    if (!newWorkflowName.trim()) return;

    createWorkflow({
      name: newWorkflowName,
      description: '',
      isActive: true,
      triggerType: 'manual',
      triggerConfig: {},
      blocks: [],
      connections: []
    });

    setNewWorkflowName('');
    setIsCreating(false);
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Workflows</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
            title="Create workflow"
          >
            <Plus size={18} className="text-slate-600" />
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="border-b border-slate-200 p-3 bg-slate-50">
          <input
            type="text"
            value={newWorkflowName}
            onChange={(e) => setNewWorkflowName(e.target.value)}
            placeholder="Workflow name"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') {
                setIsCreating(false);
                setNewWorkflowName('');
              }
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewWorkflowName('');
              }}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {workflows.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-sm">
            No workflows yet. Create one to get started!
          </div>
        ) : (
          <div className="p-2">
            {workflows.map(workflow => (
              <div
                key={workflow.id}
                className={`mb-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  currentWorkflow?.id === workflow.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
                onClick={() => setCurrentWorkflow(workflow)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-800 truncate">{workflow.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {workflow.blocks.length} blocks
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {workflow.isActive ? (
                      <Power size={14} className="text-emerald-500" />
                    ) : (
                      <PowerOff size={14} className="text-slate-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      executeWorkflow(workflow.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-500 text-white rounded text-xs font-medium hover:bg-emerald-600 transition-colors"
                  >
                    <Play size={12} />
                    Run
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateWorkflow(workflow.id, { isActive: !workflow.isActive });
                    }}
                    className="px-2 py-1.5 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                    title={workflow.isActive ? 'Disable' : 'Enable'}
                  >
                    {workflow.isActive ? (
                      <PowerOff size={12} className="text-slate-600" />
                    ) : (
                      <Power size={12} className="text-slate-600" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this workflow?')) {
                        deleteWorkflow(workflow.id);
                      }
                    }}
                    className="px-2 py-1.5 border border-slate-300 rounded hover:bg-red-50 hover:border-red-300 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={12} className="text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowList;
