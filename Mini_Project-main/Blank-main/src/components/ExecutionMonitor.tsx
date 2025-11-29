import React, { useState } from 'react';
import { CircleCheck as CheckCircle, Circle as XCircle, Clock, CirclePlay as PlayCircle, CircleAlert as AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { ExecutionStatus, LogLevel } from '../types/workflow';

const statusIcons: Record<ExecutionStatus, React.ReactNode> = {
  pending: <Clock size={16} className="text-slate-400" />,
  running: <PlayCircle size={16} className="text-blue-500 animate-pulse" />,
  completed: <CheckCircle size={16} className="text-emerald-500" />,
  failed: <XCircle size={16} className="text-red-500" />,
  cancelled: <AlertCircle size={16} className="text-amber-500" />
};

const logLevelColors: Record<LogLevel, string> = {
  info: 'text-blue-600 bg-blue-50',
  warning: 'text-amber-600 bg-amber-50',
  error: 'text-red-600 bg-red-50',
  debug: 'text-slate-600 bg-slate-50'
};

const ExecutionMonitor: React.FC = () => {
  const { executions, workflows } = useWorkflow();
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);

  const sortedExecutions = [...executions].sort((a, b) => {
    const aTime = a.startedAt?.getTime() || 0;
    const bTime = b.startedAt?.getTime() || 0;
    return bTime - aTime;
  });

  if (executions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <div className="text-center">
          <PlayCircle size={48} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No executions yet</p>
          <p className="text-slate-400 text-sm mt-1">Run a workflow to see execution logs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Execution History</h2>

        <div className="space-y-3">
          {sortedExecutions.map(execution => {
            const workflow = workflows.find(w => w.id === execution.workflowId);
            const isExpanded = expandedExecution === execution.id;
            const duration = execution.completedAt && execution.startedAt
              ? Math.round((execution.completedAt.getTime() - execution.startedAt.getTime()) / 1000)
              : null;

            return (
              <div key={execution.id} className="bg-white rounded-lg shadow-sm border border-slate-200">
                <button
                  onClick={() => setExpandedExecution(isExpanded ? null : execution.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                  <div className="flex-shrink-0">
                    {statusIcons[execution.status]}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-slate-800">
                      {workflow?.name || 'Unknown Workflow'}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                      <span>
                        {execution.startedAt?.toLocaleString() || 'Not started'}
                      </span>
                      {duration && (
                        <span className="text-slate-400">
                          {duration}s
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      execution.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      execution.status === 'running' ? 'bg-blue-100 text-blue-700' :
                      execution.status === 'failed' ? 'bg-red-100 text-red-700' :
                      execution.status === 'cancelled' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {execution.status}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-200 px-4 py-3 bg-slate-50">
                    {execution.errorMessage && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="font-medium text-red-800 text-sm mb-1">Error</div>
                        <div className="text-red-700 text-sm">{execution.errorMessage}</div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Execution Logs</h4>
                      {execution.logs.length === 0 ? (
                        <p className="text-sm text-slate-500">No logs available</p>
                      ) : (
                        execution.logs.map(log => (
                          <div
                            key={log.id}
                            className="flex gap-3 text-sm border-l-2 border-slate-200 pl-3 py-1"
                          >
                            <span className="text-xs text-slate-400 flex-shrink-0 w-20">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${logLevelColors[log.logLevel]}`}>
                              {log.logLevel}
                            </span>
                            <span className="text-slate-700 flex-1">{log.message}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExecutionMonitor;
