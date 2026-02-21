import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { modalBackdropAnimation, modalPanelAnimation } from '../../animations/auth-animations';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
  animations: [modalBackdropAnimation, modalPanelAnimation]
})
export class AuthModalComponent {
  @Input() title = 'Notice';
  @Input() description = '';
  @Input() primaryActionLabel = 'Close';

  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly primaryAction = new EventEmitter<void>();

  protected closeModal(): void {
    this.closed.emit();
  }

  protected confirmAction(): void {
    this.primaryAction.emit();
  }
}
