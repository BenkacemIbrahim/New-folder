import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ProjectStatus } from '../../models/project-feature.model';

@Component({
  selector: 'app-project-status-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './project-status-badge.component.html',
  styleUrl: './project-status-badge.component.scss'
})
export class ProjectStatusBadgeComponent {
  @Input({ required: true }) status!: ProjectStatus;

  protected get statusClass(): string {
    switch (this.status) {
      case 'On Track':
        return 'on-track';
      case 'At Risk':
        return 'at-risk';
      default:
        return 'blocked';
    }
  }
}
