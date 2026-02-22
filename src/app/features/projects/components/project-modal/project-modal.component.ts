import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { modalBackdropAnimation, modalPanelAnimation } from '../../animations/projects-animations';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [NgIf, MatIconModule, TranslatePipe],
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
