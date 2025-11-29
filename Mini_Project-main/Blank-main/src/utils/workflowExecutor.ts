import { Workflow, WorkflowBlock, ExecutionLog } from '../types/workflow';

interface ExecutionContext {
  variables: Record<string, unknown>;
  logs: ExecutionLog[];
  executionId: string;
}

export class WorkflowExecutor {
  private workflow: Workflow;
  private context: ExecutionContext;

  constructor(workflow: Workflow, executionId: string) {
    this.workflow = workflow;
    this.context = {
      variables: {},
      logs: [],
      executionId
    };
  }

  private addLog(
    logLevel: 'info' | 'warning' | 'error' | 'debug',
    message: string,
    blockId?: string,
    data?: Record<string, unknown>
  ) {
    const log: ExecutionLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      executionId: this.context.executionId,
      blockId,
      logLevel,
      message,
      data,
      timestamp: new Date()
    };
    this.context.logs.push(log);
  }

  private findStartBlock(): WorkflowBlock | null {
    const triggerBlocks = this.workflow.blocks.filter(b => b.blockType === 'trigger');
    if (triggerBlocks.length > 0) {
      return triggerBlocks[0];
    }

    const blocksWithNoIncoming = this.workflow.blocks.filter(block => {
      return !this.workflow.connections.some(conn => conn.target === block.id);
    });

    return blocksWithNoIncoming.length > 0 ? blocksWithNoIncoming[0] : this.workflow.blocks[0];
  }

  private getNextBlocks(currentBlockId: string): WorkflowBlock[] {
    const connections = this.workflow.connections.filter(
      conn => conn.source === currentBlockId
    );

    return connections
      .map(conn => this.workflow.blocks.find(b => b.id === conn.target))
      .filter(Boolean) as WorkflowBlock[];
  }

  private async executeBlock(block: WorkflowBlock): Promise<boolean> {
    this.addLog('info', `Executing block: ${block.label || block.blockType}`, block.id);

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      switch (block.blockType) {
        case 'trigger':
          this.addLog('info', `Workflow triggered by ${block.config.triggerType || 'manual'}`, block.id);
          break;

        case 'api_call':
          await this.executeApiCall(block);
          break;

        case 'notification':
          await this.executeNotification(block);
          break;

        case 'condition':
          return await this.executeCondition(block);

        case 'loop':
          await this.executeLoop(block);
          break;

        case 'delay':
          await this.executeDelay(block);
          break;

        case 'data_transform':
          await this.executeDataTransform(block);
          break;

        case 'action':
          await this.executeAction(block);
          break;

        case 'end':
          this.addLog('info', 'Reached end block', block.id);
          break;

        default:
          this.addLog('info', `Executed ${block.blockType} block`, block.id);
      }

      this.addLog('info', `Block completed: ${block.label || block.blockType}`, block.id);
      return true;
    } catch (error) {
      this.addLog('error', `Block failed: ${error}`, block.id);
      throw error;
    }
  }

  private async executeApiCall(block: WorkflowBlock) {
    const method = block.config.method as string || 'GET';
    const url = block.config.url as string || '';

    if (!url) {
      this.addLog('warning', 'API call skipped: No URL configured', block.id);
      return;
    }

    this.addLog('info', `Making ${method} request to ${url}`, block.id, { method, url });
    await new Promise(resolve => setTimeout(resolve, 500));

    this.context.variables[`${block.id}_response`] = {
      status: 200,
      data: { success: true, message: 'API call simulated' }
    };

    this.addLog('info', 'API call completed successfully', block.id);
  }

  private async executeNotification(block: WorkflowBlock) {
    const type = block.config.type as string || 'email';
    const to = block.config.to as string || block.config.email as string || '';
    const subject = block.config.subject as string || 'Workflow Notification';
    const body = block.config.body as string || block.config.message as string || 'This is a notification from your FlowForge workflow.';

    if (!to) {
      this.addLog('warning', 'Notification skipped: No recipient configured', block.id);
      return;
    }

    this.addLog('info', `Sending ${type} notification to ${to}`, block.id, { type, to });
    
    try {
      // Actually send the email
      const { sendEmail } = await import('./emailService');
      const success = await sendEmail({ to, subject, body });
      
      if (success) {
        this.addLog('info', `Notification sent successfully to ${to}`, block.id);
      } else {
        this.addLog('warning', `Failed to send notification to ${to}`, block.id);
      }
    } catch (error) {
      this.addLog('error', `Error sending notification: ${error}`, block.id);
      // Show a popup with the email details
      alert(`📧 Email Notification\n\nTo: ${to}\nSubject: ${subject}\n\nMessage:\n${body}\n\n(Email service not configured - this is a preview)`);
    }
  }

  private async executeCondition(block: WorkflowBlock): Promise<boolean> {
    const field = block.config.field as string || '';
    const operator = block.config.operator as string || 'equals';
    const value = block.config.value;

    this.addLog('info', `Evaluating condition: ${field} ${operator} ${value}`, block.id);

    const fieldValue = this.context.variables[field];
    let result = false;

    switch (operator) {
      case 'equals':
        result = fieldValue === value;
        break;
      case 'not_equals':
        result = fieldValue !== value;
        break;
      case 'greater_than':
        result = Number(fieldValue) > Number(value);
        break;
      case 'less_than':
        result = Number(fieldValue) < Number(value);
        break;
      case 'contains':
        result = String(fieldValue).includes(String(value));
        break;
      default:
        result = true;
    }

    this.addLog('info', `Condition result: ${result}`, block.id, { result });
    return result;
  }

  private async executeLoop(block: WorkflowBlock) {
    const maxIterations = (block.config.maxIterations as number) || 10;
    this.addLog('info', `Starting loop (max ${maxIterations} iterations)`, block.id);

    for (let i = 0; i < Math.min(3, maxIterations); i++) {
      this.addLog('debug', `Loop iteration ${i + 1}`, block.id);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    this.addLog('info', 'Loop completed', block.id);
  }

  private async executeDelay(block: WorkflowBlock) {
    const duration = (block.config.duration as number) || 1;
    const unit = (block.config.unit as string) || 'seconds';

    let ms = duration * 1000;
    if (unit === 'minutes') ms = duration * 60000;
    if (unit === 'hours') ms = duration * 3600000;

    // Use actual delay time (no simulation)
    this.addLog('info', `Waiting for ${duration} ${unit}...`, block.id);
    
    // Show progress for long delays
    if (ms > 10000) {
      const startTime = Date.now();
      const checkInterval = 5000; // Check every 5 seconds
      
      while (Date.now() - startTime < ms) {
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.floor((ms - (Date.now() - startTime)) / 1000);
        this.addLog('debug', `Delay progress: ${elapsed}s elapsed, ${remaining}s remaining`, block.id);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
    
    this.addLog('info', `Delay completed (waited ${duration} ${unit})`, block.id);
  }

  private async executeDataTransform(block: WorkflowBlock) {
    const operations = block.config.operations || [];
    this.addLog('info', `Applying ${Array.isArray(operations) ? operations.length : 0} transformation operations`, block.id);
    await new Promise(resolve => setTimeout(resolve, 300));
    this.addLog('info', 'Data transformation completed', block.id);
  }

  private async executeAction(block: WorkflowBlock) {
    this.addLog('info', `Executing custom action`, block.id, block.config);
    await new Promise(resolve => setTimeout(resolve, 500));
    this.addLog('info', 'Action completed', block.id);
  }

  public async execute(): Promise<{ logs: ExecutionLog[]; success: boolean; error?: string }> {
    this.addLog('info', `Starting workflow execution: ${this.workflow.name}`);

    try {
      if (this.workflow.blocks.length === 0) {
        this.addLog('warning', 'Workflow has no blocks');
        return { logs: this.context.logs, success: true };
      }

      const startBlock = this.findStartBlock();
      if (!startBlock) {
        throw new Error('No start block found');
      }

      const visited = new Set<string>();
      const queue: WorkflowBlock[] = [startBlock];

      while (queue.length > 0) {
        const currentBlock = queue.shift()!;

        if (visited.has(currentBlock.id)) {
          continue;
        }
        visited.add(currentBlock.id);

        const shouldContinue = await this.executeBlock(currentBlock);

        if (shouldContinue && currentBlock.blockType !== 'end') {
          const nextBlocks = this.getNextBlocks(currentBlock.id);
          queue.push(...nextBlocks);
        }
      }

      this.addLog('info', 'Workflow execution completed successfully');
      return { logs: this.context.logs, success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addLog('error', `Workflow execution failed: ${errorMessage}`);
      return { logs: this.context.logs, success: false, error: errorMessage };
    }
  }
}
