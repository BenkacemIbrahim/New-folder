import { animate, style, transition, trigger } from '@angular/animations';

import { MOTION_DISTANCE, MOTION_DURATION, motion } from '../../../shared/animations/motion.config';

export const drawerBackdropAnimation = trigger('drawerBackdropAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(motion(MOTION_DURATION.modal), style({ opacity: 1 }))
  ]),
  transition(':leave', [animate(motion(MOTION_DURATION.modal), style({ opacity: 0 }))])
]);

export const drawerSlideAnimation = trigger('drawerSlideAnimation', [
  transition(':enter', [
    style({ transform: `translateX(${MOTION_DISTANCE.drawer}px)`, opacity: 0 }),
    animate(
      motion(MOTION_DURATION.base),
      style({ transform: 'translateX(0)', opacity: 1 })
    )
  ]),
  transition(':leave', [
    animate(
      motion(MOTION_DURATION.base),
      style({ transform: `translateX(${MOTION_DISTANCE.drawer}px)`, opacity: 0 })
    )
  ])
]);

export const dropPulseAnimation = trigger('dropPulseAnimation', [
  transition(':enter', [
    style({ opacity: 0.22 }),
    animate(motion(MOTION_DURATION.modal), style({ opacity: 0 }))
  ])
]);
