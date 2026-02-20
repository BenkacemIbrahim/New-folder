import { NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, effect, inject, signal } from '@angular/core';

import { MOTION_DURATION, motion } from '../../animations/motion.config';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [NgIf],
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.component.scss',
  animations: [
    trigger('loaderFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(motion(MOTION_DURATION.fast), style({ opacity: 1 }))
      ]),
      transition(':leave', [animate(motion(MOTION_DURATION.base), style({ opacity: 0 }))])
    ])
  ]
})
export class GlobalLoaderComponent {
  private readonly loadingService = inject(LoadingService);
  protected readonly isVisible = signal(false);

  constructor() {
    effect(
      (onCleanup) => {
        const loading = this.loadingService.isLoading();
        let timer: ReturnType<typeof setTimeout> | null = null;

        if (loading) {
          timer = setTimeout(() => this.isVisible.set(true), 130);
        } else {
          this.isVisible.set(false);
        }

        onCleanup(() => {
          if (timer) {
            clearTimeout(timer);
          }
        });
      },
      { allowSignalWrites: true }
    );
  }
}
