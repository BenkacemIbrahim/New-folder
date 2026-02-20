import { NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { MOTION_DURATION, motion } from '../../../../shared/animations/motion.config';
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
        animate(motion(MOTION_DURATION.modal), style({ opacity: 1 }))
      ]),
      transition(':leave', [animate(motion(MOTION_DURATION.modal), style({ opacity: 0 }))])
    ]),
    trigger('modalPanel', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.98)' }),
        animate(
          motion(MOTION_DURATION.modal),
          style({ opacity: 1, transform: 'scale(1)' })
        )
      ]),
      transition(':leave', [
        animate(motion(MOTION_DURATION.modal), style({ opacity: 0, transform: 'scale(0.98)' }))
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
