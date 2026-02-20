import { NgClass, NgFor } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';

import { MOTION_DURATION_BASE, MOTION_DURATION_FAST } from '../../../core/config/app.constants';
import { ToastMessage } from '../../../core/models/toast.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-outlet',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './toast-outlet.component.html',
  styleUrl: './toast-outlet.component.scss',
  animations: [
    trigger('toastSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px) translateX(20px)' }),
        animate(
          `${MOTION_DURATION_BASE}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
          style({ opacity: 1, transform: 'translateY(0) translateX(0)' })
        )
      ]),
      transition(':leave', [
        animate(
          `${MOTION_DURATION_FAST}ms ease-in`,
          style({ opacity: 0, transform: 'translateY(-8px) translateX(16px)' })
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
