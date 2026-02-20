import { NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { LandingButtonComponent } from '../../ui/landing-button/landing-button.component';

@Component({
  selector: 'app-signup-preview-modal',
  standalone: true,
  imports: [NgIf, LandingButtonComponent],
  templateUrl: './signup-preview-modal.component.html',
  styleUrl: './signup-preview-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('modalBackdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('220ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [animate('180ms ease-in', style({ opacity: 0 }))])
    ]),
    trigger('modalPanel', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px) scale(0.98)' }),
        animate(
          '280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        )
      ]),
      transition(':leave', [
        animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(12px) scale(0.99)' }))
      ])
    ])
  ]
})
export class SignupPreviewModalComponent {
  @Input() open = false;
  @Output() readonly close = new EventEmitter<void>();

  protected closeModal(): void {
    this.close.emit();
  }
}

