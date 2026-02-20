export type KanbanStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface KanbanTask {
  id: string;
  title: string;
  summary: string;
  assignee: string;
  assigneeInitials: string;
  priority: TaskPriority;
  status: KanbanStatus;
  storyPoints: number;
  dueDate: string;
  tags: string[];
  updatedAt: string;
}

export interface KanbanColumn {
  key: KanbanStatus;
  title: string;
  subtitle: string;
}

export type KanbanBoardState = Record<KanbanStatus, KanbanTask[]>;
