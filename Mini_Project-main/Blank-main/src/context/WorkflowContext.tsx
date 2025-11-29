import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Workflow,
  WorkflowBlock,
  WorkflowConnection,
  WorkflowExecution,
  AISuggestion
} from '../types/workflow';
import { WorkflowExecutor } from '../utils/workflowExecutor';

interface WorkflowContextType {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  executions: WorkflowExecution[];
  suggestions: AISuggestion[];
  createWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  addBlock: (block: Omit<WorkflowBlock, 'id' | 'workflowId'>) => void;
  updateBlock: (id: string, updates: Partial<WorkflowBlock>) => void;
  deleteBlock: (id: string) => void;
  addConnection: (connection: Omit<WorkflowConnection, 'id' | 'workflowId'>) => void;
  deleteConnection: (id: string) => void;
  executeWorkflow: (workflowId: string) => Promise<void>;
  generateSuggestions: (workflowId: string) => void;
  applySuggestion: (suggestionId: string) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  const createWorkflow = useCallback((workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWorkflow: Workflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setCurrentWorkflow(newWorkflow);
  }, []);

  const updateWorkflow = useCallback((id: string, updates: Partial<Workflow>) => {
    setWorkflows(prev =>
      prev.map(w => (w.id === id ? { ...w, ...updates, updatedAt: new Date() } : w))
    );
    if (currentWorkflow?.id === id) {
      setCurrentWorkflow(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  }, [currentWorkflow]);

  const deleteWorkflow = useCallback((id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    if (currentWorkflow?.id === id) {
      setCurrentWorkflow(null);
    }
  }, [currentWorkflow]);

  const addBlock = useCallback((block: Omit<WorkflowBlock, 'id' | 'workflowId'>) => {
    if (!currentWorkflow) return;

    const newBlock: WorkflowBlock = {
      ...block,
      id: `block-${Date.now()}`,
      workflowId: currentWorkflow.id
    };

    const updatedWorkflow = {
      ...currentWorkflow,
      blocks: [...currentWorkflow.blocks, newBlock],
      updatedAt: new Date()
    };

    setCurrentWorkflow(updatedWorkflow);
    updateWorkflow(currentWorkflow.id, updatedWorkflow);
  }, [currentWorkflow, updateWorkflow]);

  const updateBlock = useCallback((id: string, updates: Partial<WorkflowBlock>) => {
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      blocks: currentWorkflow.blocks.map(b => (b.id === id ? { ...b, ...updates } : b)),
      updatedAt: new Date()
    };

    setCurrentWorkflow(updatedWorkflow);
    updateWorkflow(currentWorkflow.id, updatedWorkflow);
  }, [currentWorkflow, updateWorkflow]);

  const deleteBlock = useCallback((id: string) => {
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      blocks: currentWorkflow.blocks.filter(b => b.id !== id),
      connections: currentWorkflow.connections.filter(
        c => c.source !== id && c.target !== id
      ),
      updatedAt: new Date()
    };

    setCurrentWorkflow(updatedWorkflow);
    updateWorkflow(currentWorkflow.id, updatedWorkflow);
  }, [currentWorkflow, updateWorkflow]);

  const addConnection = useCallback((connection: Omit<WorkflowConnection, 'id' | 'workflowId'>) => {
    if (!currentWorkflow) return;

    const newConnection: WorkflowConnection = {
      ...connection,
      id: `connection-${Date.now()}`,
      workflowId: currentWorkflow.id
    };

    const updatedWorkflow = {
      ...currentWorkflow,
      connections: [...currentWorkflow.connections, newConnection],
      updatedAt: new Date()
    };

    setCurrentWorkflow(updatedWorkflow);
    updateWorkflow(currentWorkflow.id, updatedWorkflow);
  }, [currentWorkflow, updateWorkflow]);

  const deleteConnection = useCallback((id: string) => {
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      connections: currentWorkflow.connections.filter(c => c.id !== id),
      updatedAt: new Date()
    };

    setCurrentWorkflow(updatedWorkflow);
    updateWorkflow(currentWorkflow.id, updatedWorkflow);
  }, [currentWorkflow, updateWorkflow]);

  const executeWorkflow = useCallback(async (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    const executionId = `execution-${Date.now()}`;
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      status: 'running',
      triggerSource: 'manual',
      startedAt: new Date(),
      executionData: {},
      logs: []
    };

    setExecutions(prev => [...prev, execution]);

    const executor = new WorkflowExecutor(workflow, executionId);
    const result = await executor.execute();

    execution.logs = result.logs;
    execution.status = result.success ? 'completed' : 'failed';
    execution.completedAt = new Date();

    if (!result.success && result.error) {
      execution.errorMessage = result.error;
    }

    setExecutions(prev =>
      prev.map(e => (e.id === execution.id ? execution : e))
    );
  }, [workflows]);

  const generateSuggestions = useCallback((workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    const newSuggestions: AISuggestion[] = [];

    if (workflow.blocks.length > 0 && !workflow.blocks.some(b => b.blockType === 'condition')) {
      newSuggestions.push({
        id: `suggestion-${Date.now()}-1`,
        workflowId,
        suggestionType: 'new_block',
        title: 'Add Error Handling',
        description: 'Consider adding a condition block to handle potential errors in your workflow.',
        isApplied: false,
        createdAt: new Date()
      });
    }

    if (workflow.blocks.some(b => b.blockType === 'api_call')) {
      newSuggestions.push({
        id: `suggestion-${Date.now()}-2`,
        workflowId,
        suggestionType: 'optimization',
        title: 'Add Retry Logic',
        description: 'API calls can fail. Consider adding retry logic with exponential backoff.',
        isApplied: false,
        createdAt: new Date()
      });
    }

    if (workflow.blocks.length > 5 && workflow.blocks.filter(b => b.blockType === 'notification').length === 0) {
      newSuggestions.push({
        id: `suggestion-${Date.now()}-3`,
        workflowId,
        suggestionType: 'new_block',
        title: 'Add Notification',
        description: 'Your workflow has multiple steps. Consider adding a notification block to alert when complete.',
        isApplied: false,
        createdAt: new Date()
      });
    }

    if (workflow.blocks.some(b => b.blockType === 'loop') && !workflow.blocks.some(b => b.blockType === 'delay')) {
      newSuggestions.push({
        id: `suggestion-${Date.now()}-4`,
        workflowId,
        suggestionType: 'optimization',
        title: 'Add Rate Limiting',
        description: 'Loop detected. Consider adding a delay block to prevent rate limiting issues.',
        isApplied: false,
        createdAt: new Date()
      });
    }

    setSuggestions(prev => [...prev.filter(s => s.workflowId !== workflowId), ...newSuggestions]);
  }, [workflows]);

  const applySuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === suggestionId ? { ...s, isApplied: true } : s))
    );
  }, []);

  return (
    <WorkflowContext.Provider
      value={{
        workflows,
        currentWorkflow,
        executions,
        suggestions,
        createWorkflow,
        updateWorkflow,
        deleteWorkflow,
        setCurrentWorkflow,
        addBlock,
        updateBlock,
        deleteBlock,
        addConnection,
        deleteConnection,
        executeWorkflow,
        generateSuggestions,
        applySuggestion
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within WorkflowProvider');
  }
  return context;
};
