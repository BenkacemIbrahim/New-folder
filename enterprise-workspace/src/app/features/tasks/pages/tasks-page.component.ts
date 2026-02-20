import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { Task } from '../../../core/models/task.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [NgFor, MatCardModule, MatChipsModule, PageHeaderComponent],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss'
})
export class TasksPageComponent {
  protected readonly tasks: Task[] = [
    {
      id: 'TSK-442',
      title: 'Finalize migration runbook',
      assignee: 'Elena Kim',
      priority: 'High',
      status: 'In Progress',
      dueDate: 'Feb 24, 2026'
    },
    {
      id: 'TSK-447',
      title: 'Document SSO fallback flow',
      assignee: 'Marcus Lee',
      priority: 'Medium',
      status: 'Review',
      dueDate: 'Feb 27, 2026'
    },
    {
      id: 'TSK-453',
      title: 'Create analytics QA checklist',
      assignee: 'Priya Nair',
      priority: 'Low',
      status: 'To Do',
      dueDate: 'Mar 01, 2026'
    }
  ];
}
