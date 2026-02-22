import { NgClass, NgFor } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MOTION_DISTANCE, MOTION_DURATION, motion } from '../../animations/motion.config';
import { ToastMessage } from '../../../core/models/toast.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-outlet',
  standalone: true,
  imports: [NgFor, NgClass, TranslatePipe],
  templateUrl: './toast-outlet.component.html',
  styleUrl: './toast-outlet.component.scss',
  animations: [
    trigger('toastSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: `translateY(${MOTION_DISTANCE.page}px)` }),
        animate(
          motion(MOTION_DURATION.base),
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate(
          motion(MOTION_DURATION.fast),
          style({ opacity: 0, transform: `translateY(-${MOTION_DISTANCE.page}px)` })
        )
      ])
    ])
  ]
})
export class ToastOutletComponent {
  private readonly toastService = inject(ToastService);

  protected readonly toasts = this.toastService.messages;

  protected dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  protected trackById(_index: number, toast: ToastMessage): string {
    return toast.id;
  }
}
