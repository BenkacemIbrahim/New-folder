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
  inject,
  signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

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
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DatePipe, DragDropModule, MatIconModule, TranslatePipe],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [drawerBackdropAnimation, drawerSlideAnimation, dropPulseAnimation]
})
export class TasksPageComponent {
  private readonly translationService = inject(TranslationService);

  protected readonly locale = this.translationService.currentLocale;
  protected readonly columns: readonly KanbanColumn[] = [
    {
      key: 'TODO',
      title: 'TASKS.COLUMNS.TODO.TITLE',
      subtitle: 'TASKS.COLUMNS.TODO.SUBTITLE'
    },
    {
      key: 'IN_PROGRESS',
      title: 'TASKS.COLUMNS.IN_PROGRESS.TITLE',
      subtitle: 'TASKS.COLUMNS.IN_PROGRESS.SUBTITLE'
    },
    {
      key: 'DONE',
      title: 'TASKS.COLUMNS.DONE.TITLE',
      subtitle: 'TASKS.COLUMNS.DONE.SUBTITLE'
    }
  ];

  protected readonly connectedDropLists: KanbanStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

  private readonly boardState = signal<KanbanBoardState>({
    TODO: [
      {
        id: 'TASK-748',
        title: 'TASKS.ITEMS.TASK_748.TITLE',
        summary: 'TASKS.ITEMS.TASK_748.SUMMARY',
        assignee: 'Mia Chen',
        assigneeInitials: 'MC',
        priority: 'CRITICAL',
        status: 'TODO',
        storyPoints: 8,
        dueDate: '2026-02-24',
        tags: ['TASKS.TAGS.SECURITY', 'TASKS.TAGS.PLATFORM'],
        updatedAt: '2026-02-20T09:15:00Z'
      },
      {
        id: 'TASK-752',
        title: 'TASKS.ITEMS.TASK_752.TITLE',
        summary: 'TASKS.ITEMS.TASK_752.SUMMARY',
        assignee: 'Elena Kim',
        assigneeInitials: 'EK',
        priority: 'MEDIUM',
        status: 'TODO',
        storyPoints: 5,
        dueDate: '2026-02-26',
        tags: ['TASKS.TAGS.QUALITY'],
        updatedAt: '2026-02-20T07:40:00Z'
      }
    ],
    IN_PROGRESS: [
      {
        id: 'TASK-733',
        title: 'TASKS.ITEMS.TASK_733.TITLE',
        summary: 'TASKS.ITEMS.TASK_733.SUMMARY',
        assignee: 'Noah Patel',
        assigneeInitials: 'NP',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        storyPoints: 13,
        dueDate: '2026-02-22',
        tags: ['TASKS.TAGS.BILLING', 'TASKS.TAGS.RELIABILITY'],
        updatedAt: '2026-02-20T10:52:00Z'
      },
      {
        id: 'TASK-736',
        title: 'TASKS.ITEMS.TASK_736.TITLE',
        summary: 'TASKS.ITEMS.TASK_736.SUMMARY',
        assignee: 'Ava Romero',
        assigneeInitials: 'AR',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        storyPoints: 8,
        dueDate: '2026-02-25',
        tags: ['TASKS.TAGS.ANALYTICS', 'TASKS.TAGS.DATA'],
        updatedAt: '2026-02-20T09:02:00Z'
      }
    ],
    DONE: [
      {
        id: 'TASK-701',
        title: 'TASKS.ITEMS.TASK_701.TITLE',
        summary: 'TASKS.ITEMS.TASK_701.SUMMARY',
        assignee: 'Priya Nair',
        assigneeInitials: 'PN',
        priority: 'LOW',
        status: 'DONE',
        storyPoints: 3,
        dueDate: '2026-02-18',
        tags: ['TASKS.TAGS.FRONTEND'],
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

  protected statusLabelKey(status: KanbanStatus): string {
    switch (status) {
      case 'TODO':
        return 'TASKS.STATUS.TODO';
      case 'IN_PROGRESS':
        return 'TASKS.STATUS.IN_PROGRESS';
      case 'DONE':
        return 'TASKS.STATUS.DONE';
    }
  }

  protected priorityLabelKey(priority: KanbanTask['priority']): string {
    switch (priority) {
      case 'CRITICAL':
        return 'TASKS.PRIORITY.CRITICAL';
      case 'HIGH':
        return 'TASKS.PRIORITY.HIGH';
      case 'MEDIUM':
        return 'TASKS.PRIORITY.MEDIUM';
      case 'LOW':
        return 'TASKS.PRIORITY.LOW';
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
