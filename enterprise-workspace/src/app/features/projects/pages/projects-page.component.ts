import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Project } from '../../../core/models/project.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [NgFor, MatCardModule, MatProgressBarModule, MatChipsModule, PageHeaderComponent],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent {
  protected readonly projects: Project[] = [
    {
      id: 'PRJ-101',
      name: 'Learning Platform 2.0',
      owner: 'Mia Chen',
      status: 'On Track',
      progress: 74,
      dueDate: 'Mar 14, 2026'
    },
    {
      id: 'PRJ-114',
      name: 'Enterprise Billing Rewrite',
      owner: 'Noah Patel',
      status: 'At Risk',
      progress: 49,
      dueDate: 'Apr 02, 2026'
    },
    {
      id: 'PRJ-129',
      name: 'Content Insights Pipeline',
      owner: 'Ava Romero',
      status: 'Blocked',
      progress: 36,
      dueDate: 'Apr 28, 2026'
    }
  ];
}
