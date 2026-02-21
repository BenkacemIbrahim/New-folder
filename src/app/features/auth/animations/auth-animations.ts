import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

import { MOTION_DISTANCE, MOTION_DURATION, motion } from '../../../shared/animations/motion.config';

export const authPageAnimation = trigger('authPageAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: `translateY(${MOTION_DISTANCE.page}px)` }),
    animate(motion(MOTION_DURATION.base), style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const staggerTextAnimation = trigger('staggerTextAnimation', [
  transition(':enter', [
    query(
      '.reveal-item',
      [
        style({ opacity: 0, transform: `translateY(${MOTION_DISTANCE.reveal}px)` }),
        stagger(
          36,
          animate(
            motion(MOTION_DURATION.base),
            style({ opacity: 1, transform: 'translateY(0)' })
          )
        )
      ],
      { optional: true }
    )
  ])
]);

export const fieldErrorAnimation = trigger('fieldErrorAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-6px)' }),
    animate(motion(MOTION_DURATION.fast), style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate(motion(MOTION_DURATION.fast), style({ opacity: 0, transform: 'translateY(-6px)' }))
  ])
]);

export const modalBackdropAnimation = trigger('modalBackdropAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(motion(MOTION_DURATION.modal), style({ opacity: 1 }))
  ]),
  transition(':leave', [animate(motion(MOTION_DURATION.modal), style({ opacity: 0 }))])
]);

export const modalPanelAnimation = trigger('modalPanelAnimation', [
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
]);
