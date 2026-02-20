import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  drawerBackdropAnimation,
  drawerSlideAnimation,
  dropPulseAnimation
} from '../animations/tasks-kanban.animations';
import {
  KanbanBoardState,
  KanbanColumn,
  KanbanStatus,
  KanbanTask
} from '../models/kanban-task.model';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DatePipe, DragDropModule, MatIconModule, PageHeaderComponent],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [drawerBackdropAnimation, drawerSlideAnimation, dropPulseAnimation]
})
export class TasksPageComponent {
  protected readonly columns: readonly KanbanColumn[] = [
    {
      key: 'TODO',
      title: 'To Do',
      subtitle: 'Ready for execution'
    },
    {
      key: 'IN_PROGRESS',
      title: 'In Progress',
      subtitle: 'Actively being delivered'
    },
    {
      key: 'DONE',
      title: 'Done',
      subtitle: 'Shipped and validated'
    }
  ];

  protected readonly connectedDropLists: KanbanStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

  private readonly boardState = signal<KanbanBoardState>({
    TODO: [
      {
        id: 'TASK-748',
        title: 'Finalize enterprise access matrix',
        summary: 'Align permission scopes for PMO, leadership, and regional operations teams.',
        assignee: 'Mia Chen',
        assigneeInitials: 'MC',
        priority: 'CRITICAL',
        status: 'TODO',
        storyPoints: 8,
        dueDate: '2026-02-24',
        tags: ['Security', 'Platform'],
        updatedAt: '2026-02-20T09:15:00Z'
      },
      {
        id: 'TASK-752',
        title: 'Draft sprint quality checkpoint',
        summary: 'Define release readiness checklist for integration and QA handoff.',
        assignee: 'Elena Kim',
        assigneeInitials: 'EK',
        priority: 'MEDIUM',
        status: 'TODO',
        storyPoints: 5,
        dueDate: '2026-02-26',
        tags: ['Quality'],
        updatedAt: '2026-02-20T07:40:00Z'
      }
    ],
    IN_PROGRESS: [
      {
        id: 'TASK-733',
        title: 'Implement billing failover playbook',
        summary: 'Ship fallback workflow for partial payment events and retry orchestration.',
        assignee: 'Noah Patel',
        assigneeInitials: 'NP',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        storyPoints: 13,
        dueDate: '2026-02-22',
        tags: ['Billing', 'Reliability'],
        updatedAt: '2026-02-20T10:52:00Z'
      },
      {
        id: 'TASK-736',
        title: 'Refactor analytics event schema',
        summary: 'Normalize learner completion events before warehouse ingestion.',
        assignee: 'Ava Romero',
        assigneeInitials: 'AR',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        storyPoints: 8,
        dueDate: '2026-02-25',
        tags: ['Analytics', 'Data'],
        updatedAt: '2026-02-20T09:02:00Z'
      }
    ],
    DONE: [
      {
        id: 'TASK-701',
        title: 'Release navigation performance patch',
        summary: 'Reduced route transition overhead and improved shell render consistency.',
        assignee: 'Priya Nair',
        assigneeInitials: 'PN',
        priority: 'LOW',
        status: 'DONE',
        storyPoints: 3,
        dueDate: '2026-02-18',
        tags: ['Frontend'],
        updatedAt: '2026-02-19T18:20:00Z'
      }
    ]
  });

  protected readonly totalTasks = computed(() => {
    const board = this.boardState();
    return board.TODO.length + board.IN_PROGRESS.length + board.DONE.length;
  });

  protected readonly selectedTaskId = signal<string | null>(null);
  protected readonly dropFeedbackColumn = signal<KanbanStatus | null>(null);

  protected readonly selectedTask = computed<KanbanTask | null>(() => {
    const taskId = this.selectedTaskId();
    if (!taskId) {
      return null;
    }

    const board = this.boardState();
    for (const status of this.connectedDropLists) {
      const match = board[status].find((task) => task.id === taskId);
      if (match) {
        return match;
      }
    }

    return null;
  });

  protected getTasksForColumn(status: KanbanStatus): KanbanTask[] {
    return this.boardState()[status];
  }

  protected drop(event: CdkDragDrop<KanbanTask[]>, targetStatus: KanbanStatus): void {
    this.boardState.update((current) => {
      const nextState: KanbanBoardState = {
        TODO: [...current.TODO],
        IN_PROGRESS: [...current.IN_PROGRESS],
        DONE: [...current.DONE]
      };

      const targetList = nextState[targetStatus];

      if (event.previousContainer === event.container) {
        moveItemInArray(targetList, event.previousIndex, event.currentIndex);
      } else {
        const sourceStatus = event.previousContainer.id as KanbanStatus;
        const sourceList = nextState[sourceStatus];

        transferArrayItem(sourceList, targetList, event.previousIndex, event.currentIndex);

        const movedTask = targetList[event.currentIndex];
        if (movedTask) {
          targetList[event.currentIndex] = {
            ...movedTask,
            status: targetStatus,
            updatedAt: new Date().toISOString()
          };
        }
      }

      return nextState;
    });

    this.highlightDrop(targetStatus);
  }

  protected openTask(taskId: string): void {
    this.selectedTaskId.set(taskId);
  }

  protected closeDrawer(): void {
    this.selectedTaskId.set(null);
  }

  protected priorityClass(task: KanbanTask): string {
    switch (task.priority) {
      case 'CRITICAL':
        return 'critical';
      case 'HIGH':
        return 'high';
      case 'MEDIUM':
        return 'medium';
      default:
        return 'low';
    }
  }

  protected columnCount(status: KanbanStatus): number {
    return this.boardState()[status].length;
  }

  protected trackByColumn(_index: number, column: KanbanColumn): string {
    return column.key;
  }

  protected trackByTask(_index: number, task: KanbanTask): string {
    return task.id;
  }

  private highlightDrop(column: KanbanStatus): void {
    this.dropFeedbackColumn.set(column);
    setTimeout(() => {
      if (this.dropFeedbackColumn() === column) {
        this.dropFeedbackColumn.set(null);
      }
    }, 420);
  }
}
