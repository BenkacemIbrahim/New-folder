import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { modalBackdropAnimation, modalPanelAnimation } from '../../animations/projects-animations';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss',
  animations: [modalBackdropAnimation, modalPanelAnimation]
})
export class ProjectModalComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle = '';

  @Output() readonly closed = new EventEmitter<void>();

  protected close(): void {
    this.closed.emit();
  }
}
